const config = require('../config')

/**
 * 语音评测工具
 * 基于百度语音评测 API
 * 参考：CodeShockWave/Wechat-Mini-Program
 */
class VoiceEvaluation {
  constructor() {
    this.apiUrl = 'https://vop.baidu.com/pro_api'
    this.tokenCache = null
    this.tokenExpireTime = 0
  }

  /**
   * 评测发音
   * @param {string} audioPath - 音频文件路径
   * @param {string} text - 标准文本
   * @param {string} mode - 评测模式：word(单词)/sentence(句子)
   * @returns {Promise<Object>} 评测结果
   */
  async evaluate(audioPath, text, mode = 'word') {
    try {
      // 读取音频文件
      const fs = wx.getFileSystemManager()
      const audioData = fs.readFileSync(audioPath, 'base64')
      
      // 获取 Access Token
      const token = await this.getAccessToken()
      
      // 调用评测 API
      const response = await this.callEvaluationAPI(token, audioData, text, mode)
      
      return this.parseEvaluationResult(response)
    } catch (error) {
      console.error('语音评测失败:', error)
      throw error
    }
  }

  /**
   * 调用百度评测 API
   */
  async callEvaluationAPI(token, audioData, text, mode) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.apiUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          format: 'pcm',
          rate: 16000,
          channel: 1,
          cuid: 'dictation-assistant',
          token: token,
          speech: audioData,
          len: audioData.length,
          // 评测参数
          eval_mode: mode === 'word' ? 1 : 0,
          ref_text: text
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.err_no === 0) {
            resolve(res.data)
          } else {
            reject(new Error(res.data.err_msg || '评测失败'))
          }
        },
        fail: reject
      })
    })
  }

  /**
   * 解析评测结果
   */
  parseEvaluationResult(response) {
    const result = response.result
    
    return {
      // 总体评分 (0-100)
      score: Math.round(result.overall_score || 0),
      
      // 准确度评分 (0-100)
      accuracy: Math.round(result.accuracy_score || 0),
      
      // 流利度评分 (0-100)
      fluency: Math.round(result.fluency_score || 0),
      
      // 完整度评分 (0-100)
      completeness: Math.round(result.integrity_score || 0),
      
      // 详细信息
      details: result.words || [],
      
      // 评级 (优秀/良好/一般/需改进)
      grade: this.getGrade(result.overall_score || 0)
    }
  }

  /**
   * 根据分数获取评级
   */
  getGrade(score) {
    if (score >= 90) return '优秀'
    if (score >= 75) return '良好'
    if (score >= 60) return '一般'
    return '需改进'
  }

  /**
   * 获取百度 Access Token
   */
  async getAccessToken() {
    // 检查缓存
    const now = Date.now()
    if (this.tokenCache && now < this.tokenExpireTime) {
      return this.tokenCache
    }

    // 请求新 token
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token',
        method: 'GET',
        data: {
          grant_type: 'client_credentials',
          client_id: config.baiduTTS.apiKey,
          client_secret: config.baiduTTS.secretKey
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.access_token) {
            this.tokenCache = res.data.access_token
            // token 有效期 30 天，提前 1 天过期
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

module.exports = new VoiceEvaluation()
