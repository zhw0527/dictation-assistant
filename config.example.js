// 配置文件模板 - 供其他开发者参考
// 复制此文件为 config.js 并填入真实的配置信息

const config = {
  // 微信小程序配置
  wechat: {
    appId: 'your_app_id',
    appSecret: 'your_app_secret'
  },

  // 百度云文字识别配置
  baiduOCR: {
    appName: 'your_app_name',
    appId: 'your_app_id',
    apiKey: 'your_api_key',
    secretKey: 'your_secret_key'
  },

  // 百度云语音合成配置
  baiduTTS: {
    appId: 'your_app_id',
    apiKey: 'your_api_key',
    secretKey: 'your_secret_key'
  },

  // 服务器配置
  server: {
    host: 'your_server_ip'
  }
}

module.exports = config
