#!/bin/bash

# 密钥重置助手脚本
# 用于在重置所有密钥后快速更新配置文件

echo "🔐 听写助理 - 密钥更新助手"
echo "================================"
echo ""

CONFIG_FILE="$HOME/Documents/听写助理/config.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 错误: 找不到 config.js 文件"
    exit 1
fi

echo "📝 请输入新的密钥信息："
echo ""

# 微信小程序
echo "--- 微信小程序 ---"
read -p "AppID (wxa697c9e737f7df2d): " WECHAT_APPID
WECHAT_APPID=${WECHAT_APPID:-wxa697c9e737f7df2d}

read -p "AppSecret (新密钥): " WECHAT_SECRET
if [ -z "$WECHAT_SECRET" ]; then
    echo "⚠️  警告: AppSecret 为空，跳过更新"
fi

echo ""
echo "--- 百度 OCR ---"
read -p "API Key (新密钥): " BAIDU_OCR_KEY
read -p "Secret Key (新密钥): " BAIDU_OCR_SECRET

echo ""
echo "--- 百度 TTS ---"
read -p "API Key (新密钥): " BAIDU_TTS_KEY
read -p "Secret Key (新密钥): " BAIDU_TTS_SECRET

echo ""
echo "--- 服务器 ---"
read -p "服务器 IP (123.57.135.148): " SERVER_IP
SERVER_IP=${SERVER_IP:-123.57.135.148}

echo ""
echo "🔄 正在更新配置文件..."

# 备份原配置
cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# 创建新配置
cat > "$CONFIG_FILE" << EOF
// 配置文件 - 包含所有API密钥和服务器信息
// 注意：此文件包含敏感信息，已添加到 .gitignore，不会提交到 GitHub
// 最后更新: $(date)

const config = {
  // 微信小程序配置
  wechat: {
    appId: '${WECHAT_APPID}',
    appSecret: '${WECHAT_SECRET}'
  },

  // 百度云文字识别配置
  baiduOCR: {
    appName: 'tingxiezhuli',
    appId: '7432651',
    apiKey: '${BAIDU_OCR_KEY}',
    secretKey: '${BAIDU_OCR_SECRET}'
  },

  // 百度云语音合成配置
  baiduTTS: {
    appId: '121798724',
    apiKey: '${BAIDU_TTS_KEY}',
    secretKey: '${BAIDU_TTS_SECRET}'
  },

  // 阿里云服务器配置
  server: {
    host: '${SERVER_IP}'
  }
}

module.exports = config
EOF

echo ""
echo "✅ 配置文件已更新！"
echo ""
echo "📋 下一步操作："
echo "1. 测试新配置是否工作："
echo "   cd ~/Documents/听写助理"
echo "   npm start"
echo ""
echo "2. 在微信开发者工具中测试小程序"
echo ""
echo "3. 如果有问题，可以恢复备份："
echo "   ls -la ~/Documents/听写助理/config.js.backup.*"
echo ""
echo "🔒 安全提醒："
echo "- 不要将 config.js 提交到 Git"
echo "- 定期更换密钥（建议每3-6个月）"
echo "- 保管好备份文件"
echo ""
