// pages/index/index.js
Page({
  data: {
    
  },

  onLoad() {
    
  },

  // 开始听写
  startDictation() {
    wx.navigateTo({
      url: '/pages/dictation/dictation'
    })
  },

  // 查看历史记录
  goToHistory() {
    wx.switchTab({
      url: '/pages/history/history'
    })
  },

  // 查看排行榜
  goToRanking() {
    wx.navigateTo({
      url: '/pages/ranking/ranking'
    })
  },

  // 导入词汇
  importWords() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
