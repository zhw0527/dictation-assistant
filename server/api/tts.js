const express = require('express')
const router = express.Router()
const AipSpeechClient = require('baidu-aip-sdk').speech
const config = require('../../config')

// 初始化百度语音合成客户端
const client = new AipSpeechClient(
  config.baiduTTS.appId,
  config.baiduTTS.apiKey,
  config.baiduTTS.secretKey
)

/**
 * 文字转语音接口
 * POST /api/tts/synthesize
 * Body: { text: "要转换的文字" }
 */
router.post('/synthesize', async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({
        success: false,
        message: '请提供要转换的文字'
      })
    }

    // 调用百度语音合成
    const result = await client.text2audio(text, {
      spd: 5, // 语速，取值0-15，默认为5中语速
      pit: 5, // 音调，取值0-15，默认为5中语调
      vol: 5, // 音量，取值0-15，默认为5中音量
      per: 0  // 发音人选择, 0为女声，1为男声，3为情感合成-度逍遥，4为情感合成-度丫丫
    })

    if (result.data) {
      // 返回音频数据
      res.set({
        'Content-Type': 'audio/mp3',
        'Content-Length': result.data.length
      })
      res.send(result.data)
    } else {
      res.status(500).json({
        success: false,
        message: '语音合成失败',
        error: result
      })
    }
  } catch (error) {
    console.error('TTS Error:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    })
  }
})

/**
 * 批量文字转语音
 * POST /api/tts/batch
 * Body: { texts: ["文字1", "文字2"] }
 */
router.post('/batch', async (req, res) => {
  try {
    const { texts } = req.body

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        success: false,
        message: '请提供文字数组'
      })
    }

    const results = []
    for (const text of texts) {
      const result = await client.text2audio(text, {
        spd: 5,
        pit: 5,
        vol: 5,
        per: 0
      })

      if (result.data) {
        results.push({
          text: text,
          audio: result.data.toString('base64')
        })
      }
    }

    res.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Batch TTS Error:', error)
    res.status(500).json({
      success: false,
      message: '批量合成失败',
      error: error.message
    })
  }
})

module.exports = router
