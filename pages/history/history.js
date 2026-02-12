// pages/history/history.js
Page({
  data: {
    historyList: []
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory()
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('dictationHistory') || []
    this.setData({
      historyList: history
    })
  },

  // 返回首页
  goToIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
