# 听写助理 - 部署指南

## 📋 目录

1. [环境准备](#环境准备)
2. [服务器部署](#服务器部署)
3. [小程序配置](#小程序配置)
4. [测试验证](#测试验证)

---

## 环境准备

### 本地开发环境

1. **安装 Node.js**
   ```bash
   # 检查是否已安装
   node --version
   npm --version
   ```

2. **安装项目依赖**
   ```bash
   cd ~/Documents/听写助理
   npm install
   ```

3. **配置文件**
   - 确保 `config.js` 文件存在且包含正确的配置信息
   - 参考 `config.example.js` 模板

---

## 服务器部署

### 连接阿里云服务器

```bash
ssh root@***REMOVED_SERVER_IP***
# 密码: ***REMOVED_PASSWORD***
```

### 安装 Node.js（如果未安装）

```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 部署项目

1. **上传项目文件**
   ```bash
   # 在本地执行
   scp -r ~/Documents/听写助理 root@***REMOVED_SERVER_IP***:/root/
   ```

2. **安装依赖**
   ```bash
   # 在服务器上执行
   cd /root/听写助理
   npm install --production
   ```

3. **使用 PM2 管理进程**
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 启动服务
   pm2 start server/index.js --name dictation-assistant
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

4. **配置防火墙**
   ```bash
   # 开放 3000 端口
   firewall-cmd --zone=public --add-port=3000/tcp --permanent
   firewall-cmd --reload
   ```

### 常用命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs dictation-assistant

# 重启服务
pm2 restart dictation-assistant

# 停止服务
pm2 stop dictation-assistant
```

---

## 小程序配置

### 1. 在微信开发者工具中打开项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 项目路径：`/Users/zhouwen/Documents/听写助理`
4. AppID：`***REMOVED_APPID***`

### 2. 配置服务器域名

在微信公众平台配置以下域名：

- **request 合法域名**：`http://***REMOVED_SERVER_IP***`
- **uploadFile 合法域名**：`http://***REMOVED_SERVER_IP***`
- **downloadFile 合法域名**：`http://***REMOVED_SERVER_IP***`

⚠️ **注意**：正式上线前需要配置 HTTPS 域名

### 3. 测试接口

在小程序中测试以下功能：
- ✅ 语音播报
- ✅ 文字识别
- ✅ 听写功能

---

## 测试验证

### 测试服务器接口

```bash
# 健康检查
curl http://***REMOVED_SERVER_IP***:3000/health

# 测试语音合成
curl -X POST http://***REMOVED_SERVER_IP***:3000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text":"你好"}' \
  --output test.mp3
```

### 测试小程序功能

1. 在微信开发者工具中点击"编译"
2. 测试首页导航
3. 测试听写功能
4. 测试语音播放
5. 查看历史记录

---

## 常见问题

### 1. 服务器连接失败

- 检查服务器是否启动：`pm2 status`
- 检查防火墙设置
- 检查阿里云安全组规则

### 2. 语音播放失败

- 检查百度 TTS API 配置
- 查看服务器日志：`pm2 logs`
- 确认 API Key 是否正确

### 3. 小程序无法访问服务器

- 检查服务器域名配置
- 开发阶段可以在微信开发者工具中勾选"不校验合法域名"

---

## 下一步优化

- [ ] 配置 HTTPS（使用 Let's Encrypt）
- [ ] 添加 Nginx 反向代理
- [ ] 实现用户认证
- [ ] 添加数据库存储
- [ ] 优化性能和缓存

---

## 联系方式

如有问题，请查看项目文档或联系开发者。
