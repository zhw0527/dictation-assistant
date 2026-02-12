// pages/test/test.js
const baiduAI = require('../../utils/baidu-ai-direct')

Page({
  data: {
    testResults: [],
    testing: false
  },

  onLoad() {
    this.addLog('测试页面已加载')
  },

  // 添加日志
  addLog(message) {
    const { testResults } = this.data
    const timestamp = new Date().toLocaleTimeString()
    testResults.push(`[${timestamp}] ${message}`)
    this.setData({ testResults })
    console.log(message)
  },

  // 测试 TTS
  async testTTS() {
    this.addLog('=== 开始测试 TTS ===')
    this.setData({ testing: true })

    try {
      // 1. 测试获取 Token
      this.addLog('正在获取 Access Token...')
      const token = await baiduAI.tts.getAccessToken()
      this.addLog(`✅ Token 获取成功: ${token.substring(0, 20)}...`)

      // 2. 测试语音合成
      this.addLog('正在合成语音: "你好，这是测试"')
      const audioData = await baiduAI.tts.textToSpeech('你好，这是测试')
      this.addLog(`✅ 语音合成成功，音频大小: ${audioData.byteLength} bytes`)

      // 3. 测试播放
      this.addLog('正在播放音频...')
      await baiduAI.tts.playAudio(audioData)
      this.addLog('✅ 播放完成')

      this.addLog('=== TTS 测试全部通过 ===')
      
      wx.showToast({
        title: 'TTS 测试成功',
        icon: 'success'
      })
    } catch (error) {
      this.addLog(`❌ TTS 测试失败: ${error.message}`)
      wx.showModal({
        title: 'TTS 测试失败',
        content: error.message,
        showCancel: false
      })
    } finally {
      this.setData({ testing: false })
    }
  },

  // 测试 OCR
  async testOCR() {
    this.addLog('=== 开始测试 OCR ===')
    this.setData({ testing: true })

    try {
      // 1. 选择图片
      this.addLog('请选择一张包含文字的图片...')
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      const imagePath = res.tempFilePaths[0]
      this.addLog(`✅ 图片已选择: ${imagePath}`)

      // 2. 测试获取 Token
      this.addLog('正在获取 Access Token...')
      const token = await baiduAI.ocr.getAccessToken()
      this.addLog(`✅ Token 获取成功: ${token.substring(0, 20)}...`)

      // 3. 测试文字识别
      this.addLog('正在识别文字...')
      const texts = await baiduAI.ocr.recognizeText(imagePath)
      this.addLog(`✅ 识别成功，共识别 ${texts.length} 行文字`)

      texts.forEach((item, index) => {
        this.addLog(`  ${index + 1}. ${item.text} (置信度: ${Math.round(item.confidence * 100)}%)`)
      })

      this.addLog('=== OCR 测试全部通过 ===')

      wx.showToast({
        title: 'OCR 测试成功',
        icon: 'success'
      })
    } catch (error) {
      if (error.errMsg && error.errMsg.includes('cancel')) {
        this.addLog('用户取消了选择图片')
      } else {
        this.addLog(`❌ OCR 测试失败: ${error.message}`)
        wx.showModal({
          title: 'OCR 测试失败',
          content: error.message,
          showCancel: false
        })
      }
    } finally {
      this.setData({ testing: false })
    }
  },

  // 清空日志
  clearLog() {
    this.setData({ testResults: [] })
  },

  // 复制日志
  copyLog() {
    const log = this.data.testResults.join('\n')
    wx.setClipboardData({
      data: log,
      success: () => {
        wx.showToast({
          title: '日志已复制',
          icon: 'success'
        })
      }
    })
  }
})
