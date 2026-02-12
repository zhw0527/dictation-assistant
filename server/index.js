const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('../config')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 导入路由
const ttsRouter = require('./api/tts')
const ocrRouter = require('./api/ocr')

// 使用路由
app.use('/api/tts', ttsRouter)
app.use('/api/ocr', ocrRouter)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '听写助理服务运行中' })
})

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 听写助理服务器运行在 http://0.0.0.0:${PORT}`)
  console.log(`📡 服务器地址: http://${config.server.host}:${PORT}`)
})

module.exports = app
