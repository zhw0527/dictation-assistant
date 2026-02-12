const config = require('../config')
const baiduAI = require('./baidu-ai-direct')

/**
 * 拍照批改工具
 * 集成百度 OCR + 智能纠错
 */
class PhotoCorrection {
  constructor() {
    // 使用直接调用的 OCR
    this.ocr = baiduAI.ocr
  }

  /**
   * 拍照识别文字
   * @param {string} imagePath - 图片路径
   * @returns {Promise<Array>} 识别的文字数组
   */
  async recognizeText(imagePath) {
    try {
      wx.showLoading({ title: '识别中...' })

      // 调用百度 OCR
      const result = await this.ocr.recognizeText(imagePath)

      wx.hideLoading()

      return result
    } catch (error) {
      wx.hideLoading()
      console.error('文字识别失败:', error)
      throw error
    }
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

}

module.exports = new PhotoCorrection()
