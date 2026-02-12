// 百度 AI 服务测试脚本
const config = require('../config')

/**
 * 测试百度 TTS（语音合成）
 */
async function testTTS() {
  console.log('=== 测试百度 TTS 语音合成 ===')
  
  try {
    // 1. 获取 Access Token
    const tokenRes = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token',
        method: 'GET',
        data: {
          grant_type: 'client_credentials',
          client_id: config.baiduTTS.apiKey,
          client_secret: config.baiduTTS.secretKey
        },
        success: resolve,
        fail: reject
      })
    })

    if (tokenRes.statusCode === 200 && tokenRes.data.access_token) {
      console.log('✅ TTS Token 获取成功')
      console.log('Token:', tokenRes.data.access_token.substring(0, 20) + '...')
      
      // 2. 测试语音合成
      const ttsRes = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://tsn.baidu.com/text2audio',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            tex: '你好，这是测试',
            tok: tokenRes.data.access_token,
            cuid: 'dictation-assistant',
            ctp: 1,
            lan: 'zh',
            spd: 5,
            pit: 5,
            vol: 5,
            per: 0,
            aue: 3
          },
          responseType: 'arraybuffer',
          success: resolve,
          fail: reject
        })
      })

      if (ttsRes.statusCode === 200) {
        console.log('✅ TTS 语音合成成功')
        console.log('音频大小:', ttsRes.data.byteLength, 'bytes')
        return { success: true, message: 'TTS 配置正确' }
      } else {
        console.error('❌ TTS 语音合成失败')
        return { success: false, message: 'TTS 合成失败' }
      }
    } else {
      console.error('❌ TTS Token 获取失败')
      return { success: false, message: 'Token 获取失败' }
    }
  } catch (error) {
    console.error('❌ TTS 测试出错:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 测试百度 OCR（文字识别）
 */
async function testOCR() {
  console.log('=== 测试百度 OCR 文字识别 ===')
  
  try {
    // 1. 获取 Access Token
    const tokenRes = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://aip.baidubce.com/oauth/2.0/token',
        method: 'GET',
        data: {
          grant_type: 'client_credentials',
          client_id: config.baiduOCR.apiKey,
          client_secret: config.baiduOCR.secretKey
        },
        success: resolve,
        fail: reject
      })
    })

    if (tokenRes.statusCode === 200 && tokenRes.data.access_token) {
      console.log('✅ OCR Token 获取成功')
      console.log('Token:', tokenRes.data.access_token.substring(0, 20) + '...')
      
      // 2. 测试文字识别（使用测试图片）
      // 注意：这里需要真实的图片才能测试，暂时只验证 Token
      return { success: true, message: 'OCR Token 配置正确，需要图片才能完整测试' }
    } else {
      console.error('❌ OCR Token 获取失败')
      return { success: false, message: 'Token 获取失败' }
    }
  } catch (error) {
    console.error('❌ OCR 测试出错:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('开始测试百度 AI 服务配置...\n')
  
  const results = {
    tts: await testTTS(),
    ocr: await testOCR()
  }
  
  console.log('\n=== 测试结果汇总 ===')
  console.log('TTS:', results.tts.success ? '✅ 通过' : '❌ 失败', '-', results.tts.message)
  console.log('OCR:', results.ocr.success ? '✅ 通过' : '❌ 失败', '-', results.ocr.message)
  
  return results
}

module.exports = {
  testTTS,
  testOCR,
  runAllTests
}
