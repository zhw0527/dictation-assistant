const config = require('../config')

/**
 * 拍照批改工具
 * 集成百度 OCR + 智能纠错
 */
class PhotoCorrection {
  constructor() {
    this.ocrApiUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic'
    this.tokenCache = null
    this.tokenExpireTime = 0
  }

  /**
   * 拍照识别文字
   * @param {string} imagePath - 图片路径
   * @returns {Promise<Array>} 识别的文字数组
   */
  async recognizeText(imagePath) {
    try {
      wx.showLoading({ title: '识别中...' })

      // 读取图片
      const fs = wx.getFileSystemManager()
      const imageData = fs.readFileSync(imagePath, 'base64')

      // 获取 Access Token
      const token = await this.getAccessToken()

      // 调用 OCR API
      const result = await this.callOCRAPI(token, imageData)

      wx.hideLoading()

      return this.parseOCRResult(result)
    } catch (error) {
      wx.hideLoading()
      console.error('文字识别失败:', error)
      throw error
    }
  }

  /**
   * 调用百度 OCR API
   */
  async callOCRAPI(token, imageData) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.ocrApiUrl}?access_token=${token}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          image: imageData,
          detect_direction: 'true',
          paragraph: 'false',
          probability: 'true'
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.words_result) {
            resolve(res.data)
          } else {
            reject(new Error(res.data.error_msg || '识别失败'))
          }
        },
        fail: reject
      })
    })
  }

  /**
   * 解析 OCR 结果
   */
  parseOCRResult(response) {
    const wordsResult = response.words_result || []
    
    return wordsResult.map(item => ({
      text: item.words.trim(),
      confidence: item.probability ? item.probability.average : 0
    }))
  }

  /**
   * 批改答案
   * @param {Array} recognizedTexts - 识别的文字
   * @param {Array} standardAnswers - 标准答案
   * @returns {Array} 批改结果
   */
  correctAnswers(recognizedTexts, standardAnswers) {
    const results = []
    const maxLength = Math.max(recognizedTexts.length, standardAnswers.length)

    for (let i = 0; i < maxLength; i++) {
      const userAnswer = recognizedTexts[i] ? recognizedTexts[i].text : ''
      const standardAnswer = standardAnswers[i] || ''

      const result = {
        index: i + 1,
        standardAnswer: standardAnswer,
        userAnswer: userAnswer,
        isCorrect: userAnswer === standardAnswer,
        confidence: recognizedTexts[i] ? recognizedTexts[i].confidence : 0
      }

      // 如果答案错误，进行智能分析
      if (!result.isCorrect && userAnswer && standardAnswer) {
        result.analysis = this.analyzeError(userAnswer, standardAnswer)
      }

      results.push(result)
    }

    return results
  }

  /**
   * 分析错误原因
   */
  analyzeError(userAnswer, standardAnswer) {
    const analysis = {
      errorType: '',
      suggestion: '',
      similarChars: []
    }

    // 判断错误类型
    if (userAnswer.length !== standardAnswer.length) {
      analysis.errorType = '字数不符'
      analysis.suggestion = `标准答案是 ${standardAnswer.length} 个字`
    } else {
      // 找出错误的字
      const wrongChars = []
      for (let i = 0; i < standardAnswer.length; i++) {
        if (userAnswer[i] !== standardAnswer[i]) {
          wrongChars.push({
            position: i + 1,
            wrong: userAnswer[i],
            correct: standardAnswer[i]
          })
        }
      }

      if (wrongChars.length > 0) {
        analysis.errorType = '写错字'
        analysis.wrongChars = wrongChars
        analysis.suggestion = `第 ${wrongChars.map(c => c.position).join('、')} 个字写错了`
      }
    }

    // 查找形近字
    analysis.similarChars = this.findSimilarChars(userAnswer, standardAnswer)

    return analysis
  }

  /**
   * 查找形近字
   */
  findSimilarChars(userAnswer, standardAnswer) {
    // 常见形近字对照表（简化版）
    const similarCharsMap = {
      '己': ['已', '巳'],
      '已': ['己', '巳'],
      '巳': ['己', '已'],
      '土': ['士'],
      '士': ['土'],
      '末': ['未'],
      '未': ['末'],
      '戊': ['戌', '戍'],
      '戌': ['戊', '戍'],
      '戍': ['戊', '戌']
    }

    const similar = []
    for (let i = 0; i < userAnswer.length; i++) {
      const userChar = userAnswer[i]
      const standardChar = standardAnswer[i]

      if (userChar !== standardChar) {
        const similarList = similarCharsMap[standardChar]
        if (similarList && similarList.includes(userChar)) {
          similar.push({
            position: i + 1,
            userChar: userChar,
            standardChar: standardChar,
            tip: `"${userChar}" 和 "${standardChar}" 是形近字，容易混淆`
          })
        }
      }
    }

    return similar
  }

  /**
   * 生成批改报告
   */
  generateReport(results) {
    const total = results.length
    const correct = results.filter(r => r.isCorrect).length
    const wrong = total - correct
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    // 统计错误类型
    const errorTypes = {}
    results.forEach(result => {
      if (!result.isCorrect && result.analysis) {
        const type = result.analysis.errorType
        errorTypes[type] = (errorTypes[type] || 0) + 1
      }
    })

    // 收集错题
    const wrongAnswers = results.filter(r => !r.isCorrect)

    return {
      summary: {
        total: total,
        correct: correct,
        wrong: wrong,
        accuracy: accuracy,
        grade: this.getGrade(accuracy)
      },
      errorTypes: errorTypes,
      wrongAnswers: wrongAnswers,
      results: results
    }
  }

  /**
   * 根据正确率获取评级
   */
  getGrade(accuracy) {
    if (accuracy >= 95) return '优秀'
    if (accuracy >= 85) return '良好'
    if (accuracy >= 70) return '中等'
    if (accuracy >= 60) return '及格'
    return '需努力'
  }

  /**
   * 获取百度 Access Token
   */
  async getAccessToken() {
    const now = Date.now()
    if (this.tokenCache && now < this.tokenExpireTime) {
      return this.tokenCache
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token',
        method: 'GET',
        data: {
          grant_type: 'client_credentials',
          client_id: config.baiduOCR.apiKey,
          client_secret: config.baiduOCR.secretKey
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.access_token) {
            this.tokenCache = res.data.access_token
            this.tokenExpireTime = now + (29 * 24 * 60 * 60 * 1000)
            resolve(this.tokenCache)
          } else {
            reject(new Error('获取 token 失败'))
          }
        },
        fail: reject
      })
    })
  }
}

module.exports = new PhotoCorrection()
