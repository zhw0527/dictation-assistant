# 🔐 安全事件处理报告

## ⚠️ 事件概述

**日期**: 2026年02月12日  
**问题**: 微信小程序密钥和其他敏感信息暴露在 GitHub 公开仓库中  
**严重程度**: 🔴 高危

---

## ✅ 已完成的安全措施

### 1. Git 历史清理 ✅
- 使用 `git-filter-repo` 工具彻底清理了所有历史提交中的敏感信息
- 所有密钥、AppID、AppSecret、服务器 IP 和密码已从历史记录中移除
- 强制推送到 GitHub，覆盖了原有的不安全历史

### 2. 文档脱敏 ✅
已清理以下文件中的敏感信息：
- `QUICKSTART.md` - 移除了 AppID、服务器 IP 和密码
- `PROJECT_SUMMARY.md` - 移除了所有 API 密钥和凭证

### 3. .gitignore 更新 ✅
确保以下文件永远不会被提交：
```
config.js
server/config.js
*.env
CREDENTIALS.md
*.backup
*.bak
```

---

## 🚨 立即需要执行的操作

### ⚡ 紧急（现在就做）

#### 1. 重置微信小程序密钥
1. 登录微信公众平台：https://mp.weixin.qq.com/
2. 进入"开发" → "开发管理" → "开发设置"
3. 找到 "AppSecret(小程序密钥)"
4. 点击"重置"按钮
5. 使用管理员微信扫码确认
6. **立即保存新的 AppSecret 到本地 `config.js` 文件**

#### 2. 重置百度云 API 密钥

**百度 OCR（文字识别）**
1. 登录百度云控制台：https://console.bce.baidu.com/
2. 进入"产品服务" → "人工智能" → "文字识别 OCR"
3. 找到应用 "tingxiezhuli"
4. 重置 API Key 和 Secret Key
5. 更新到 `config.js`

**百度 TTS（语音合成）**
1. 在百度云控制台
2. 进入"产品服务" → "人工智能" → "语音技术"
3. 找到对应应用
4. 重置 API Key 和 Secret Key
5. 更新到 `config.js`

#### 3. 更改服务器密码
```bash
# 连接到服务器
ssh root@123.57.135.148

# 更改 root 密码
passwd

# 输入新密码（两次）
# 建议使用强密码：大小写字母+数字+特殊字符，至少16位
```

#### 4. 检查服务器安全
```bash
# 查看最近的登录记录
last | head -20

# 查看失败的登录尝试
lastb | head -20

# 检查是否有可疑进程
ps aux | grep -v "USER"

# 检查网络连接
netstat -tulpn
```

---

## 🛡️ 预防措施（已实施）

### 1. 配置文件管理
- ✅ `config.js` 包含所有敏感信息，已加入 `.gitignore`
- ✅ `config.example.js` 作为模板，可以安全提交
- ✅ `CREDENTIALS.md` 保存凭证信息，已加入 `.gitignore`

### 2. 环境变量方案（推荐）
创建 `.env` 文件：
```bash
# .env
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_app_secret
BAIDU_OCR_API_KEY=your_api_key
BAIDU_OCR_SECRET_KEY=your_secret_key
BAIDU_TTS_API_KEY=your_api_key
BAIDU_TTS_SECRET_KEY=your_secret_key
SERVER_HOST=your_server_ip
```

在代码中使用：
```javascript
require('dotenv').config();

const config = {
  wechat: {
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET
  }
  // ...
}
```

### 3. Git Hooks 防护
安装 git-secrets：
```bash
# macOS
brew install git-secrets

# 在项目中设置
cd ~/Documents/听写助理
git secrets --install
git secrets --register-aws
git secrets --add 'appSecret'
git secrets --add 'apiKey'
git secrets --add 'secretKey'
```

---

## 📋 安全检查清单

### 立即执行（今天）
- [ ] 重置微信小程序 AppSecret
- [ ] 重置百度 OCR API 密钥
- [ ] 重置百度 TTS API 密钥
- [ ] 更改服务器 root 密码
- [ ] 检查服务器登录日志
- [ ] 更新本地 `config.js` 文件

### 短期（本周内）
- [ ] 启用微信小程序的 IP 白名单
- [ ] 配置服务器防火墙规则
- [ ] 启用服务器 SSH 密钥登录
- [ ] 禁用服务器密码登录
- [ ] 安装 fail2ban 防止暴力破解
- [ ] 配置 HTTPS 证书

### 长期（持续）
- [ ] 定期更换密钥（每3-6个月）
- [ ] 监控 API 调用量
- [ ] 审查服务器日志
- [ ] 使用密钥管理服务（如 AWS Secrets Manager）
- [ ] 实施最小权限原则

---

## 🔍 如何检查密钥是否被滥用

### 1. 微信小程序
- 登录微信公众平台
- 查看"统计" → "用户分析"
- 检查是否有异常的用户增长或 API 调用

### 2. 百度云服务
- 登录百度云控制台
- 查看"费用中心" → "消费记录"
- 检查是否有异常的 API 调用量和费用

### 3. 服务器
```bash
# 查看 Nginx/Apache 访问日志
tail -f /var/log/nginx/access.log

# 查看应用日志
pm2 logs dictation-assistant

# 检查系统资源使用
top
htop
```

---

## 📞 紧急联系方式

### 平台客服
- **微信开放平台**: https://developers.weixin.qq.com/community/
- **百度云客服**: 400-890-0088
- **阿里云客服**: 95187

### 安全事件报告
如果发现密钥被滥用：
1. 立即重置所有密钥
2. 联系平台客服说明情况
3. 检查是否有资金损失
4. 保存证据（日志、截图）

---

## 📚 参考资料

- [GitHub 安全最佳实践](https://docs.github.com/en/code-security)
- [微信小程序安全指南](https://developers.weixin.qq.com/miniprogram/dev/framework/security.html)
- [OWASP 密钥管理备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)

---

## ✅ 总结

**Git 历史已完全清理**，所有敏感信息已从 GitHub 仓库中移除。

**下一步最重要的操作**：
1. ⚡ 立即重置所有密钥
2. 🔒 更改服务器密码
3. 🔍 检查是否有异常使用

**预防未来泄露**：
- 使用环境变量
- 安装 git-secrets
- 定期审查代码

---

**处理日期**: 2026年02月12日  
**处理人**: 自动化安全脚本  
**状态**: ✅ Git 历史清理完成，等待密钥重置
