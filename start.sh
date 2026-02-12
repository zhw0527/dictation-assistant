#!/bin/bash

# 听写助理 - 快速启动脚本

echo "🚀 启动听写助理服务..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
fi

# 检查配置文件
if [ ! -f "config.js" ]; then
    echo "⚠️  未找到 config.js 配置文件"
    echo "请复制 config.example.js 为 config.js 并填入配置信息"
    exit 1
fi

# 启动服务器
echo "✅ 启动服务器..."
npm start
