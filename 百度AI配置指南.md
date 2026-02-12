# 百度 AI 配置指南

## ✅ 配置已完成

您的百度 TTS 和 OCR 已经配置完成，可以直接使用！

---

## 📋 当前配置信息

### 百度 TTS（语音合成）
- **AppID**: 121798724
- **API Key**: 93eDFqbgjhNqYgz2Milinrgb
- **Secret Key**: XrLDIDx9S1wtnX7vPSKC73dnRjYTf0OD
- **状态**: ✅ 已配置

### 百度 OCR（文字识别）
- **AppID**: 7432651
- **API Key**: kug1GR5WoswrN22R5CguwETY
- **Secret Key**: 7TvDyl6Cbcfm6c1MIZMX4ejmDKmTULxq
- **状态**: ✅ 已配置

---

## 🚀 快速测试

### 方式一：使用测试页面（推荐）

1. **在微信开发者工具中打开项目**

2. **编译项目**

3. **在首页添加测试入口**（临时）
   - 或直接在地址栏输入：`pages/test/test`

4. **测试 TTS**
   - 点击"🔊 测试 TTS"按钮
   - 会自动合成并播放"你好，这是测试"
   - 查看日志确认是否成功

5. **测试 OCR**
   - 点击"📷 测试 OCR"按钮
   - 选择一张包含文字的图片
   - 查看识别结果

---

### 方式二：直接在听写页面测试

1. **测试 TTS**
   - 进入听写页面
   - 点击"开始听写"
   - 点击"🔊 播放"按钮
   - 应该能听到语音播报

2. **测试 OCR**
   - 在听写页面
   - 点击"📷 拍照批改"按钮
   - 选择图片
   - 查看识别结果

---

## 🔧 技术实现

### 直接调用方式

项目已升级为**直接调用百度 API**，不再依赖后端服务器：

```javascript
// 使用方式
const baiduAI = require('../../utils/baidu-ai-direct')

// TTS 语音合成
const audioData = await baiduAI.tts.textToSpeech('你好')
await baiduAI.tts.playAudio(audioData)

// OCR 文字识别
const texts = await baiduAI.ocr.recognizeText(imagePath)
```

### 优势
- ✅ 不依赖后端服务器
- ✅ 响应速度更快
- ✅ 更容易调试
- ✅ Token 自动缓存

---

## 📝 API 配置文件

配置文件位置：`config.js`

```javascript
const config = {
  // 百度云语音合成配置
  baiduTTS: {
    appId: '121798724',
    apiKey: '93eDFqbgjhNqYgz2Milinrgb',
    secretKey: 'XrLDIDx9S1wtnX7vPSKC73dnRjYTf0OD'
  },

  // 百度云文字识别配置
  baiduOCR: {
    appName: 'tingxiezhuli',
    appId: '7432651',
    apiKey: 'kug1GR5WoswrN22R5CguwETY',
    secretKey: '7TvDyl6Cbcfm6c1MIZMX4ejmDKmTULxq'
  }
}
```

---

## 🐛 常见问题

### 1. TTS 播放失败

**可能原因**:
- 网络问题
- API Key 错误
- 文字内容为空

**解决方法**:
```javascript
// 检查错误信息
try {
  const audioData = await baiduAI.tts.textToSpeech('测试')
  await baiduAI.tts.playAudio(audioData)
} catch (error) {
  console.error('TTS 错误:', error.message)
}
```

---

### 2. OCR 识别失败

**可能原因**:
- 图片不清晰
- 图片太大
- 网络问题
- API Key 错误

**解决方法**:
- 确保图片清晰
- 压缩图片大小
- 检查网络连接
- 查看错误日志

---

### 3. Token 获取失败

**可能原因**:
- API Key 或 Secret Key 错误
- 网络无法访问百度服务器

**解决方法**:
```javascript
// 手动测试 Token 获取
const token = await baiduAI.tts.getAccessToken()
console.log('Token:', token)
```

---

## 📊 API 限额

### 百度 TTS
- **免费额度**: 每天 5000 次
- **QPS 限制**: 10 次/秒
- **文本长度**: 最大 1024 字节

### 百度 OCR
- **免费额度**: 每天 500 次
- **QPS 限制**: 2 次/秒
- **图片大小**: 最大 4MB

---

## 🔐 安全建议

1. **不要泄露 API Key**
   - config.js 已加入 .gitignore
   - 不要提交到公开仓库

2. **定期更换密钥**
   - 建议每 3-6 个月更换一次

3. **监控使用量**
   - 在百度云控制台查看使用情况
   - 避免超出免费额度

---

## 📱 微信小程序配置

### 服务器域名配置

在微信公众平台配置以下域名：

**request 合法域名**:
- https://aip.baidubce.com
- https://tsn.baidu.com

**步骤**:
1. 登录 https://mp.weixin.qq.com/
2. 开发 → 开发管理 → 开发设置
3. 服务器域名 → request 合法域名
4. 添加上述域名

**开发阶段**:
- 在微信开发者工具中
- 详情 → 本地设置
- 勾选"不校验合法域名"

---

## ✅ 测试清单

- [ ] TTS Token 获取成功
- [ ] TTS 语音合成成功
- [ ] TTS 音频播放成功
- [ ] OCR Token 获取成功
- [ ] OCR 文字识别成功
- [ ] 听写页面语音播报正常
- [ ] 拍照批改功能正常

---

## 🎯 下一步

配置完成后，您可以：

1. **测试所有功能**
   - 使用测试页面验证
   - 在实际场景中测试

2. **优化配置**
   - 调整语音参数（语速、音调等）
   - 优化 OCR 识别准确率

3. **监控使用**
   - 查看 API 调用次数
   - 确保不超出限额

---

## 📞 获取帮助

如果遇到问题：

1. 查看测试页面的日志
2. 检查微信开发者工具的控制台
3. 查看百度云控制台的调用记录
4. 参考百度 AI 官方文档

---

**配置完成时间**: 2026-02-12  
**配置状态**: ✅ 可用
