# ⚡ 紧急操作清单

## 🚨 立即执行（现在就做！）

### ✅ 已完成
- [x] 清理 Git 历史中的敏感信息
- [x] 从文档中移除密钥
- [x] 强制推送到 GitHub
- [x] 安装 pre-commit hook 防止未来泄露

### ⏰ 待办事项（按优先级）

#### 1️⃣ 重置微信小程序密钥（最高优先级）⚠️

**操作步骤：**
1. 打开浏览器访问：https://mp.weixin.qq.com/
2. 使用管理员账号登录
3. 点击左侧菜单："开发" → "开发管理" → "开发设置"
4. 找到 "AppSecret(小程序密钥)" 部分
5. 点击"重置"按钮
6. 使用管理员微信扫码确认
7. **复制新的 AppSecret**
8. 更新本地配置文件

**更新配置：**
```bash
# 方法1: 使用自动化脚本
cd ~/Documents/听写助理
./update-keys.sh

# 方法2: 手动编辑
open -a TextEdit ~/Documents/听写助理/config.js
# 找到 appSecret 字段，替换为新密钥
```

---

#### 2️⃣ 重置百度云 API 密钥 ⚠️

**百度 OCR（文字识别）：**
1. 访问：https://console.bce.baidu.com/ai/#/ai/ocr/overview/index
2. 点击"应用列表"
3. 找到应用 "tingxiezhuli" (AppID: 7432651)
4. 点击"管理" → "重置密钥"
5. 复制新的 API Key 和 Secret Key
6. 更新到 `config.js` 的 `baiduOCR` 部分

**百度 TTS（语音合成）：**
1. 访问：https://console.bce.baidu.com/ai/#/ai/speech/overview/index
2. 点击"应用列表"
3. 找到对应应用 (AppID: 121798724)
4. 点击"管理" → "重置密钥"
5. 复制新的 API Key 和 Secret Key
6. 更新到 `config.js` 的 `baiduTTS` 部分

---

#### 3️⃣ 更改服务器密码 🔒

```bash
# 1. 连接到服务器
ssh root@123.57.135.148

# 2. 更改密码
passwd

# 3. 输入新密码（建议格式）
# - 至少16位
# - 包含大小写字母、数字、特殊字符
# - 例如：Aa1!Bb2@Cc3#Dd4$

# 4. 确认新密码

# 5. 退出并测试新密码
exit
ssh root@123.57.135.148
```

**更新本地记录：**
```bash
# 编辑 CREDENTIALS.md（不会提交到 Git）
open -a TextEdit ~/Documents/听写助理/CREDENTIALS.md
```

---

#### 4️⃣ 检查是否有异常使用 🔍

**微信小程序：**
```
1. 登录 https://mp.weixin.qq.com/
2. 查看"统计" → "用户分析"
3. 检查近期用户数量是否异常
4. 查看"开发" → "运维中心" → "错误日志"
```

**百度云：**
```
1. 登录 https://console.bce.baidu.com/
2. 点击右上角"费用中心"
3. 查看"消费记录"
4. 检查是否有异常的 API 调用
```

**服务器：**
```bash
ssh root@123.57.135.148

# 查看最近登录记录
last | head -20

# 查看失败的登录尝试
lastb | head -20

# 检查进程
ps aux | grep -v "USER"

# 检查网络连接
netstat -tulpn | grep LISTEN
```

---

## 📝 完成后的验证

### 测试新配置是否工作

```bash
# 1. 启动后端服务
cd ~/Documents/听写助理
npm start

# 2. 在另一个终端测试 API
curl http://localhost:3000/health

# 3. 在微信开发者工具中测试小程序
# - 打开微信开发者工具
# - 导入项目
# - 使用新的 AppID 和 AppSecret
# - 测试语音播放功能
# - 测试历史记录功能
```

---

## 🎯 完成标准

所有密钥重置完成后，你应该：

- [ ] 微信小程序可以正常运行
- [ ] 百度 TTS 语音播放正常
- [ ] 百度 OCR 识别功能正常（如果已实现）
- [ ] 可以使用新密码登录服务器
- [ ] 没有发现异常的 API 调用或费用
- [ ] 本地 `config.js` 已更新所有新密钥
- [ ] `CREDENTIALS.md` 已更新所有新凭证

---

## 📞 遇到问题？

### 微信小程序问题
- 错误代码 40001：AppSecret 错误，检查是否正确复制
- 错误代码 40013：AppID 无效，检查 AppID 是否正确

### 百度云问题
- 错误码 110：Access token invalid，检查 API Key 是否正确
- 错误码 111：Access token expired，重新获取 token

### 服务器问题
- 无法连接：检查 IP 地址和网络
- 密码错误：使用阿里云控制台重置密码

---

## ⏱️ 预计时间

- 重置微信密钥：5分钟
- 重置百度密钥：10分钟
- 更改服务器密码：3分钟
- 检查异常使用：10分钟
- 测试验证：10分钟

**总计：约 40 分钟**

---

## 🔐 安全建议

完成上述操作后，建议：

1. **启用双因素认证**（如果平台支持）
2. **设置 IP 白名单**（限制 API 调用来源）
3. **定期更换密钥**（每3-6个月）
4. **监控 API 使用量**（设置告警）
5. **使用密钥管理服务**（如 1Password、LastPass）

---

**最后更新**: 2026-02-12
**状态**: ⏳ 等待执行
