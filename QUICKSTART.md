# 🎯 快速开始 - 听写助理

## 📦 项目已完成配置！

您的听写助理微信小程序项目已经完全配置好，可以立即开始开发和使用。

---

## 🚀 三步开始使用

### 步骤 1️⃣：启动后端服务

打开终端，执行：

```bash
cd ~/Documents/听写助理
npm install
npm start
```

或使用快速启动脚本：

```bash
cd ~/Documents/听写助理
./start.sh
```

看到以下信息表示启动成功：
```
🚀 听写助理服务器运行在 http://0.0.0.0:3000
📡 服务器地址: http://***REMOVED_SERVER_IP***:3000
```

### 步骤 2️⃣：打开微信开发者工具

1. 启动微信开发者工具
2. 选择"导入项目"
3. 填写信息：
   - **项目目录**：`/Users/zhouwen/Documents/听写助理`
   - **AppID**：`***REMOVED_APPID***`
   - **项目名称**：听写助理
4. 点击"导入"

### 步骤 3️⃣：开始开发

在微信开发者工具中：
1. 点击"详情" → "本地设置"
2. 勾选"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"
3. 点击"编译"
4. 开始测试和开发！

---

## 💻 在 Cursor 中开发

项目已经在 Cursor 中打开，您可以：

1. 直接在 Cursor 中编辑代码
2. 使用 AI 辅助编程
3. 修改后在微信开发者工具中实时预览

---

## 📱 测试功能

### 测试听写功能

1. 在小程序首页点击"开始听写"
2. 点击"开始听写"按钮
3. 点击"🔊 播放"听取词汇
4. 输入答案
5. 点击"下一个"继续
6. 完成后查看成绩

### 测试历史记录

1. 切换到"历史记录"标签
2. 查看之前的听写记录
3. 查看详细的对错情况

---

## 🌐 部署到服务器

当您准备好部署到阿里云服务器时：

```bash
# 1. 连接服务器
ssh root@***REMOVED_SERVER_IP***
# 密码: ***REMOVED_PASSWORD***

# 2. 在本地上传项目（新开一个终端）
scp -r ~/Documents/听写助理 root@***REMOVED_SERVER_IP***:/root/

# 3. 在服务器上安装依赖并启动
cd /root/听写助理
npm install --production
npm install -g pm2
pm2 start server/index.js --name dictation-assistant
pm2 save
pm2 startup
```

详细部署步骤请查看：[DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [README.md](./README.md) | 项目介绍和概述 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 开发指南和 API 文档 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 服务器部署指南 |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | 项目配置总结 |
| [CREDENTIALS.md](./CREDENTIALS.md) | API 密钥和凭证（不提交到 Git） |

---

## 🔑 重要信息

### 微信小程序
- **AppID**: `***REMOVED_APPID***`

### 服务器
- **地址**: `http://***REMOVED_SERVER_IP***:3000`

### API 服务
- 百度语音合成（TTS）✅
- 百度文字识别（OCR）✅

所有配置信息已保存在 `config.js` 和 `CREDENTIALS.md` 中。

---

## ⚡ 常用命令

```bash
# 启动开发服务器
npm start

# 启动开发模式（自动重启）
npm run dev

# 查看 Git 状态
git status

# 提交代码
git add .
git commit -m "描述信息"
git push

# 在 Cursor 中打开项目
open -a Cursor ~/Documents/听写助理
```

---

## 🎨 功能特性

✅ **已实现**
- 智能听写流程
- 百度 TTS 语音播报
- 历史记录保存
- 成绩统计
- 进度显示

🚧 **待开发**
- 图片识别导入词汇
- 词汇库管理
- 用户系统
- 错题本
- 成绩分析

---

## 💡 开发提示

1. **修改代码后**：
   - 后端代码修改需重启服务
   - 小程序代码修改后点击"编译"

2. **调试技巧**：
   - 使用微信开发者工具的调试器
   - 查看 Console 面板的日志
   - 使用 Network 面板检查 API 请求

3. **提交代码**：
   - 使用语义化的提交信息
   - 定期推送到 GitHub

---

## 🆘 遇到问题？

1. 查看项目文档
2. 检查服务器是否启动
3. 查看控制台错误信息
4. 参考 [DEVELOPMENT.md](./DEVELOPMENT.md) 的常见问题部分

---

## 🎉 开始开发吧！

一切准备就绪，现在您可以：

✅ 在 Cursor 中编写代码  
✅ 在微信开发者工具中测试  
✅ 使用百度 AI 服务  
✅ 部署到云服务器  

祝您开发顺利！🚀

---

**GitHub 仓库**: https://github.com/zhw0527/dictation-assistant  
**本地路径**: `/Users/zhouwen/Documents/听写助理`
