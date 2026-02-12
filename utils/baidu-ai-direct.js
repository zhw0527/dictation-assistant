// 百度 AI 直接调用工具（不依赖后端服务器）
const config = require('../config')

/**
 * 百度 TTS 直接调用
 */
class BaiduTTSDirect {
  constructor() {
    this.tokenCache = null
    this.tokenExpireTime = 0
  }

  /**
   * 获取 Access Token
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
            reject(new Error('获取 token 失败: ' + JSON.stringify(res.data)))
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败: ' + err.errMsg))
        }
      })
    })
  }

  /**
   * 文字转语音
   * @param {string} text - 要转换的文字
   * @param {Object} options - 配置选项
   * @returns {Promise<ArrayBuffer>} 音频数据
   */
  async textToSpeech(text, options = {}) {
    try {
      const token = await this.getAccessToken()
      
      const params = {
        tex: text,
        tok: token,
        cuid: 'dictation-assistant',
        ctp: 1,
        lan: 'zh',
        spd: options.speed || 5,  // 语速 0-15
        pit: options.pitch || 5,  // 音调 0-15
        vol: options.volume || 5, // 音量 0-15
        per: options.person || 0, // 发音人 0-女声 1-男声 3-度逍遥 4-度丫丫
        aue: 3  // 3-mp3格式
      }

      return new Promise((resolve, reject) => {
        wx.request({
          url: 'https://tsn.baidu.com/text2audio',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: params,
          responseType: 'arraybuffer',
          success: (res) => {
            if (res.statusCode === 200) {
              // 检查是否返回的是错误信息（JSON格式）
              const uint8Array = new Uint8Array(res.data)
              const firstByte = uint8Array[0]
              
              // JSON 数据通常以 { 开头 (ASCII 123)
              if (firstByte === 123) {
                const decoder = new TextDecoder('utf-8')
                const errorText = decoder.decode(res.data)
                try {
                  const errorData = JSON.parse(errorText)
                  reject(new Error(`TTS 错误: ${errorData.err_msg || errorData.error_msg}`))
                } catch (e) {
                  reject(new Error('TTS 返回了错误数据'))
                }
              } else {
                resolve(res.data)
              }
            } else {
              reject(new Error(`TTS 请求失败: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            reject(new Error(`TTS 网络错误: ${err.errMsg}`))
          }
        })
      })
    } catch (error) {
      throw new Error(`TTS 失败: ${error.message}`)
    }
  }

  /**
   * 播放音频
   * @param {ArrayBuffer} audioData - 音频数据
   */
  async playAudio(audioData) {
    return new Promise((resolve, reject) => {
      const fs = wx.getFileSystemManager()
      const tempFilePath = `${wx.env.USER_DATA_PATH}/temp_audio_${Date.now()}.mp3`
      
      fs.writeFile({
        filePath: tempFilePath,
        data: audioData,
        success: () => {
          const innerAudioContext = wx.createInnerAudioContext()
          innerAudioContext.src = tempFilePath
          
          innerAudioContext.onPlay(() => {
            console.log('开始播放音频')
          })
          
          innerAudioContext.onEnded(() => {
            console.log('播放结束')
            innerAudioContext.destroy()
            // 删除临时文件
            fs.unlink({
              filePath: tempFilePath,
              success: () => console.log('临时文件已删除'),
              fail: () => console.log('删除临时文件失败')
            })
            resolve()
          })
          
          innerAudioContext.onError((err) => {
            console.error('播放失败:', err)
            innerAudioContext.destroy()
            reject(err)
          })
          
          innerAudioContext.play()
        },
        fail: (err) => {
          reject(new Error(`写入音频文件失败: ${err.errMsg}`))
        }
      })
    })
  }
}

/**
 * 百度 OCR 直接调用
 */
class BaiduOCRDirect {
  constructor() {
    this.tokenCache = null
    this.tokenExpireTime = 0
  }

  /**
   * 获取 Access Token
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
            reject(new Error('获取 OCR token 失败'))
          }
        },
        fail: reject
      })
    })
  }

  /**
   * 识别图片中的文字
   * @param {string} imagePath - 图片路径
   * @returns {Promise<Array>} 识别的文字数组
   */
  async recognizeText(imagePath) {
    try {
      const token = await this.getAccessToken()
      
      // 读取图片为 base64
      const fs = wx.getFileSystemManager()
      const imageData = fs.readFileSync(imagePath, 'base64')
      
      return new Promise((resolve, reject) => {
        wx.request({
          url: `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=${token}`,
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
              const texts = res.data.words_result.map(item => ({
                text: item.words.trim(),
                confidence: item.probability ? item.probability.average : 0
              }))
              resolve(texts)
            } else {
              reject(new Error(`OCR 识别失败: ${res.data.error_msg || '未知错误'}`))
            }
          },
          fail: (err) => {
            reject(new Error(`OCR 网络错误: ${err.errMsg}`))
          }
        })
      })
    } catch (error) {
      throw new Error(`OCR 失败: ${error.message}`)
    }
  }
}

// 导出单例
const tts = new BaiduTTSDirect()
const ocr = new BaiduOCRDirect()

module.exports = {
  tts,
  ocr,
  BaiduTTSDirect,
  BaiduOCRDirect
}
