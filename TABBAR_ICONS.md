# TabBar 图标说明

## 当前状态

为了让小程序能够正常运行，我已经暂时移除了 tabBar 中的图标配置。小程序现在使用纯文字的 tabBar。

## 如何添加图标（可选）

如果您想要添加 tabBar 图标，请按照以下步骤操作：

### 方法一：使用在线图标生成器

1. 访问 [iconfont](https://www.iconfont.cn/) 或 [iconpark](https://iconpark.oceanengine.com/)
2. 搜索并下载以下图标（建议尺寸：81x81 像素）：
   - 首页图标（home）
   - 历史记录图标（history）
3. 准备两种状态：
   - 未选中状态（灰色）
   - 选中状态（绿色 #07c160）

### 方法二：使用简单的纯色图标

创建 4 个简单的 PNG 图标文件，放在 `images/` 目录下：
- `home.png` - 首页未选中
- `home-active.png` - 首页选中
- `history.png` - 历史记录未选中
- `history-active.png` - 历史记录选中

### 图标规范

- **尺寸**：建议 81x81 像素（最大 40kb）
- **格式**：PNG
- **颜色**：
  - 未选中：#7A7E83（灰色）
  - 选中：#07c160（绿色）

### 添加图标后的配置

将 `app.json` 中的 tabBar 配置改为：

```json
"tabBar": {
  "color": "#7A7E83",
  "selectedColor": "#07c160",
  "borderStyle": "black",
  "backgroundColor": "#ffffff",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/home.png",
      "selectedIconPath": "images/home-active.png"
    },
    {
      "pagePath": "pages/history/history",
      "text": "历史记录",
      "iconPath": "images/history.png",
      "selectedIconPath": "images/history-active.png"
    }
  ]
}
```

## 推荐资源

- [iconfont 阿里巴巴矢量图标库](https://www.iconfont.cn/)
- [IconPark 字节跳动图标库](https://iconpark.oceanengine.com/)
- [Flaticon](https://www.flaticon.com/)

## 注意事项

1. 图标文件必须是本地路径，不能使用网络图片
2. 图标大小不能超过 40kb
3. tabBar 的 list 至少需要 2 个、最多 5 个 tab
4. 当前没有图标也不影响小程序的正常使用

---

**当前小程序已经可以正常运行，图标是可选的美化功能。**
