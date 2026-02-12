# 听写助理 - 开发指南

## 📚 目录

1. [项目概述](#项目概述)
2. [开发环境设置](#开发环境设置)
3. [代码结构](#代码结构)
4. [API 文档](#api-文档)
5. [开发流程](#开发流程)
6. [常见问题](#常见问题)

---

## 项目概述

听写助理是一个基于微信小程序的智能听写应用，集成了百度 AI 的语音合成和文字识别功能。

### 技术架构

```
┌─────────────────┐
│  微信小程序前端   │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  Node.js 后端   │
│   (Express)     │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌────────┐
│百度 TTS│ │百度 OCR│
└────────┘ └────────┘
```

---

## 开发环境设置

### 1. 安装必要工具

```bash
# 安装 Node.js (推荐 v18+)
# 访问 https://nodejs.org/

# 安装微信开发者工具
# 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 安装 Cursor (可选)
# 访问 https://cursor.sh/
```

### 2. 克隆项目

```bash
git clone https://github.com/zhw0527/dictation-assistant.git
cd dictation-assistant
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境

```bash
# 复制配置文件模板
cp config.example.js config.js

# 编辑 config.js，填入您的 API 密钥
```

### 5. 启动开发服务器

```bash
# 方式一：使用脚本
./start.sh

# 方式二：直接运行
npm start

# 方式三：开发模式（自动重启）
npm run dev
```

---

## 代码结构

### 前端（小程序）

```
pages/
├── index/              # 首页
│   ├── index.wxml     # 页面结构
│   ├── index.wxss     # 页面样式
│   ├── index.js       # 页面逻辑
│   └── index.json     # 页面配置
├── dictation/         # 听写页面
└── history/           # 历史记录页面

utils/
└── api.js             # API 调用封装

app.js                 # 小程序入口
app.json              # 全局配置
app.wxss              # 全局样式
```

### 后端（服务器）

```
server/
├── api/
│   ├── tts.js        # 语音合成路由
│   └── ocr.js        # 文字识别路由
├── utils/            # 工具函数
└── index.js          # 服务入口

config.js             # 配置文件
package.json          # 项目依赖
```

---

## API 文档

### 语音合成 API

#### POST /api/tts/synthesize

将文字转换为语音

**请求体：**
```json
{
  "text": "要转换的文字"
}
```

**响应：**
- 成功：返回音频文件（audio/mp3）
- 失败：返回错误信息

**示例：**
```javascript
const audioData = await api.textToSpeech('你好')
await api.playAudio(audioData)
```

#### POST /api/tts/batch

批量文字转语音

**请求体：**
```json
{
  "texts": ["文字1", "文字2", "文字3"]
}
```

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "text": "文字1",
      "audio": "base64编码的音频"
    }
  ]
}
```

### 文字识别 API

#### POST /api/ocr/recognize

识别图片中的文字

**请求体：**
```json
{
  "image": "base64编码的图片"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "texts": ["识别的文字1", "识别的文字2"],
    "fullText": "完整文本",
    "count": 2
  }
}
```

#### POST /api/ocr/accurate

高精度文字识别

**请求体：**
```json
{
  "image": "base64编码的图片"
}
```

**响应：**同上

---

## 开发流程

### 1. 创建新功能

```bash
# 创建新分支
git checkout -b feature/新功能名称

# 开发代码...

# 提交更改
git add .
git commit -m "feat: 添加新功能"

# 推送到远程
git push origin feature/新功能名称
```

### 2. 小程序页面开发

创建新页面的步骤：

1. 在 `pages/` 目录下创建新文件夹
2. 创建 4 个文件：`.wxml`, `.wxss`, `.js`, `.json`
3. 在 `app.json` 中注册页面
4. 编写页面逻辑和样式

### 3. 后端 API 开发

添加新 API 的步骤：

1. 在 `server/api/` 创建新路由文件
2. 编写路由处理逻辑
3. 在 `server/index.js` 中注册路由
4. 在 `utils/api.js` 中添加前端调用方法

### 4. 测试

```bash
# 测试后端 API
curl http://localhost:3000/health

# 在微信开发者工具中测试小程序功能
```

---

## 常见问题

### Q1: 如何调试小程序？

A: 在微信开发者工具中：
- 点击"调试器"标签
- 使用 `console.log()` 输出日志
- 查看 Network 面板检查网络请求

### Q2: 如何查看后端日志？

A: 
```bash
# 开发模式下直接在终端查看
npm run dev

# 生产环境使用 PM2
pm2 logs dictation-assistant
```

### Q3: 语音播放失败怎么办？

A: 检查以下几点：
1. 后端服务是否正常运行
2. 百度 TTS API 配置是否正确
3. 小程序是否有网络权限
4. 查看控制台错误信息

### Q4: 如何更新依赖？

A:
```bash
# 更新所有依赖
npm update

# 更新特定依赖
npm update package-name

# 检查过时的依赖
npm outdated
```

### Q5: 如何配置 HTTPS？

A: 参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 中的 HTTPS 配置章节

---

## 代码规范

### JavaScript

- 使用 2 空格缩进
- 使用单引号
- 函数名使用驼峰命名
- 添加必要的注释

### 小程序

- 页面文件使用小写字母
- 组件使用 PascalCase
- 数据绑定使用 `{{}}` 语法

### Git 提交

使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

---

## 有用的资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [百度 AI 开放平台](https://ai.baidu.com/)
- [Express 文档](https://expressjs.com/)
- [Node.js 文档](https://nodejs.org/docs/)

---

## 获取帮助

如有问题，请：
1. 查看项目文档
2. 搜索已有的 Issues
3. 创建新的 Issue
4. 联系开发者：65514598@qq.com
