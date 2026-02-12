const express = require('express')
const router = express.Router()
const AipOcrClient = require('baidu-aip-sdk').ocr
const config = require('../../config')

// 初始化百度OCR客户端
const client = new AipOcrClient(
  config.baiduOCR.appId,
  config.baiduOCR.apiKey,
  config.baiduOCR.secretKey
)

/**
 * 图片文字识别接口
 * POST /api/ocr/recognize
 * Body: { image: "base64编码的图片" }
 */
router.post('/recognize', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({
        success: false,
        message: '请提供图片数据'
      })
    }

    // 调用百度通用文字识别
    const result = await client.generalBasic(image)

    if (result.words_result) {
      // 提取所有文字
      const texts = result.words_result.map(item => item.words)
      
      res.json({
        success: true,
        data: {
          texts: texts,
          fullText: texts.join('\n'),
          count: texts.length
        }
      })
    } else {
      res.status(500).json({
        success: false,
        message: '文字识别失败',
        error: result
      })
    }
  } catch (error) {
    console.error('OCR Error:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    })
  }
})

/**
 * 高精度文字识别
 * POST /api/ocr/accurate
 * Body: { image: "base64编码的图片" }
 */
router.post('/accurate', async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({
        success: false,
        message: '请提供图片数据'
      })
    }

    // 调用百度高精度文字识别
    const result = await client.accurateBasic(image)

    if (result.words_result) {
      const texts = result.words_result.map(item => item.words)
      
      res.json({
        success: true,
        data: {
          texts: texts,
          fullText: texts.join('\n'),
          count: texts.length
        }
      })
    } else {
      res.status(500).json({
        success: false,
        message: '高精度识别失败',
        error: result
      })
    }
  } catch (error) {
    console.error('Accurate OCR Error:', error)
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    })
  }
})

module.exports = router
