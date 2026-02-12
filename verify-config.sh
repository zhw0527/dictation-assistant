#!/bin/bash

# 配置验证脚本 - 检查所有密钥是否已更新

echo "🔍 听写助理 - 配置验证工具"
echo "================================"
echo ""

CONFIG_FILE="$HOME/Documents/听写助理/config.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 错误: 找不到 config.js 文件"
    exit 1
fi

echo "📋 检查配置文件..."
echo ""

# 检查是否包含旧的密钥（已泄露的）
OLD_SECRETS=(
    "991429e924552c63a5d23d8486b12121"
    "kug1GR5WoswrN22R5CguwETY"
    "7TvDyl6Cbcfm6c1MIZMX4ejmDKmTULxq"
    "93eDFqbgjhNqYgz2Milinrgb"
    "XrLDIDx9S1wtnX7vPSKC73dnRjYTf0OD"
)

FOUND_OLD=0
for SECRET in "${OLD_SECRETS[@]}"; do
    if grep -q "$SECRET" "$CONFIG_FILE"; then
        echo "⚠️  警告: 发现旧密钥 ${SECRET:0:8}..."
        FOUND_OLD=1
    fi
done

if [ $FOUND_OLD -eq 1 ]; then
    echo ""
    echo "❌ 配置文件仍包含已泄露的旧密钥！"
    echo "   请立即运行 ./update-keys.sh 更新密钥"
    echo ""
    exit 1
fi

echo "✅ 未发现旧密钥"
echo ""

# 检查配置文件格式
echo "📝 检查配置格式..."

if ! node -c "$CONFIG_FILE" 2>/dev/null; then
    echo "❌ 配置文件语法错误"
    exit 1
fi

echo "✅ 配置文件格式正确"
echo ""

# 尝试加载配置
echo "🔧 加载配置..."

CONFIG_CHECK=$(node -e "
try {
    const config = require('$CONFIG_FILE');
    
    const checks = {
        'wechat.appId': config.wechat?.appId,
        'wechat.appSecret': config.wechat?.appSecret,
        'baiduOCR.apiKey': config.baiduOCR?.apiKey,
        'baiduOCR.secretKey': config.baiduOCR?.secretKey,
        'baiduTTS.apiKey': config.baiduTTS?.apiKey,
        'baiduTTS.secretKey': config.baiduTTS?.secretKey,
        'server.host': config.server?.host
    };
    
    let allOk = true;
    for (const [key, value] of Object.entries(checks)) {
        if (!value || value.length < 10) {
            console.log('❌ ' + key + ': 缺失或无效');
            allOk = false;
        } else {
            console.log('✅ ' + key + ': ' + value.substring(0, 8) + '...');
        }
    }
    
    process.exit(allOk ? 0 : 1);
} catch (e) {
    console.log('❌ 加载配置失败:', e.message);
    process.exit(1);
}
")

if [ $? -ne 0 ]; then
    echo "$CONFIG_CHECK"
    echo ""
    echo "❌ 配置验证失败"
    exit 1
fi

echo "$CONFIG_CHECK"
echo ""

# 检查 .gitignore
echo "🔒 检查 .gitignore..."

GITIGNORE_FILE="$HOME/Documents/听写助理/.gitignore"

if [ ! -f "$GITIGNORE_FILE" ]; then
    echo "⚠️  警告: .gitignore 文件不存在"
else
    if grep -q "config.js" "$GITIGNORE_FILE"; then
        echo "✅ config.js 已在 .gitignore 中"
    else
        echo "⚠️  警告: config.js 未在 .gitignore 中"
    fi
fi

echo ""

# 检查 Git 状态
echo "📦 检查 Git 状态..."

cd "$HOME/Documents/听写助理"

if git ls-files --error-unmatch config.js 2>/dev/null; then
    echo "⚠️  警告: config.js 已被 Git 跟踪！"
    echo "   运行以下命令移除："
    echo "   git rm --cached config.js"
else
    echo "✅ config.js 未被 Git 跟踪"
fi

echo ""
echo "================================"
echo "✅ 配置验证完成！"
echo ""
echo "📋 下一步："
echo "1. 如果所有检查都通过，启动服务测试："
echo "   cd ~/Documents/听写助理"
echo "   npm start"
echo ""
echo "2. 在微信开发者工具中测试小程序功能"
echo ""
echo "3. 如果有问题，查看 URGENT_TODO.md 获取帮助"
echo ""
