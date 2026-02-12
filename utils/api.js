// 工具函数 - API 请求
const config = require('../config')

const API_BASE_URL = `http://${config.server.host}:3000/api`

/**
 * 文字转语音
 * @param {string} text - 要转换的文字
 * @returns {Promise} 音频数据
 */
function textToSpeech(text) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/tts/synthesize`,
      method: 'POST',
      data: { text },
      responseType: 'arraybuffer',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error('语音合成失败'))
        }
      },
      fail: reject
    })
  })
}

/**
 * 批量文字转语音
 * @param {Array} texts - 文字数组
 * @returns {Promise} 音频数据数组
 */
function batchTextToSpeech(texts) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/tts/batch`,
      method: 'POST',
      data: { texts },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          resolve(res.data.data)
        } else {
          reject(new Error('批量语音合成失败'))
        }
      },
      fail: reject
    })
  })
}

/**
 * 图片文字识别
 * @param {string} imageBase64 - base64编码的图片
 * @returns {Promise} 识别结果
 */
function recognizeText(imageBase64) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}/ocr/recognize`,
      method: 'POST',
      data: { image: imageBase64 },
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          resolve(res.data.data)
        } else {
          reject(new Error('文字识别失败'))
        }
      },
      fail: reject
    })
  })
}

/**
 * 播放语音
 * @param {ArrayBuffer} audioData - 音频数据
 */
function playAudio(audioData) {
  return new Promise((resolve, reject) => {
    // 将音频数据写入临时文件
    const fs = wx.getFileSystemManager()
    const tempFilePath = `${wx.env.USER_DATA_PATH}/temp_audio.mp3`
    
    fs.writeFile({
      filePath: tempFilePath,
      data: audioData,
      success: () => {
        // 创建音频上下文
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = tempFilePath
        
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
        
        innerAudioContext.onEnded(() => {
          console.log('播放结束')
          resolve()
        })
        
        innerAudioContext.onError((err) => {
          console.error('播放失败', err)
          reject(err)
        })
        
        innerAudioContext.play()
      },
      fail: reject
    })
  })
}

module.exports = {
  textToSpeech,
  batchTextToSpeech,
  recognizeText,
  playAudio
}
