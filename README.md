# 听写助理

一个基于 AI 的智能听写助手微信小程序，帮助学生进行听写练习。

## ✨ 功能特点

- 📝 **智能听写**: 百度 TTS 语音播报词汇，学生输入答案
- 📚 **历史记录**: 保存每次听写的成绩和详情
- 📥 **词汇导入**: 支持图片识别批量导入听写词汇（百度 OCR）
- 📊 **成绩统计**: 实时显示正确率和进度
- 🎯 **自动评分**: 智能对比答案，即时反馈

## 🏗️ 项目结构

```
听写助理/
├── pages/              # 小程序页面
│   ├── index/         # 首页
│   ├── dictation/     # 听写页面
│   └── history/       # 历史记录页面
├── server/            # 后端服务
│   ├── api/          # API 路由
│   │   ├── tts.js    # 语音合成接口
│   │   └── ocr.js    # 文字识别接口
│   └── index.js      # 服务入口
├── utils/             # 工具函数
│   └── api.js        # API 调用封装
├── app.js             # 小程序入口
├── app.json           # 小程序配置
├── app.wxss           # 全局样式
├── config.js          # 配置文件（包含 API 密钥）
└── package.json       # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- 微信开发者工具
- 阿里云服务器（用于部署后端）

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/zhw0527/dictation-assistant.git
   cd dictation-assistant
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置文件**
   - 复制 `config.example.js` 为 `config.js`
   - 填入您的 API 密钥和配置信息

4. **启动后端服务**
   ```bash
   npm start
   # 或使用开发模式
   npm run dev
   ```

5. **打开小程序**
   - 使用微信开发者工具打开项目
   - 填写 AppID: `***REMOVED_APPID***`
   - 开始开发

## 📦 部署

详细部署步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 快速部署到阿里云

```bash
# 连接服务器
ssh root@***REMOVED_SERVER_IP***

# 上传项目
scp -r ./听写助理 root@***REMOVED_SERVER_IP***:/root/

# 在服务器上安装依赖并启动
cd /root/听写助理
npm install --production
pm2 start server/index.js --name dictation-assistant
```

## 🔧 技术栈

### 前端
- 微信小程序原生框架
- 本地存储 (wx.Storage)

### 后端
- Node.js + Express
- 百度 AI SDK
  - 语音合成 (TTS)
  - 文字识别 (OCR)

### 部署
- 阿里云 ECS
- PM2 进程管理

## 📝 待开发功能

- [x] 基础听写功能
- [x] 语音播报集成
- [ ] 图片识别导入词汇
- [ ] 词汇库管理系统
- [ ] 多用户支持
- [ ] 成绩分析图表
- [ ] 导出听写报告
- [ ] 错题本功能
- [ ] 家长端查看

## 🔐 配置说明

项目使用以下第三方服务：

- **微信小程序**: AppID `***REMOVED_APPID***`
- **百度云 TTS**: 语音合成服务
- **百度云 OCR**: 文字识别服务
- **阿里云**: 服务器托管

配置信息请查看 `CREDENTIALS.md`（不会提交到 Git）

## 📄 License

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 👨‍💻 开发者

- GitHub: [@zhw0527](https://github.com/zhw0527)
- Email: 65514598@qq.com

## 🙏 致谢

- 百度 AI 开放平台
- 微信小程序团队
- 所有贡献者
