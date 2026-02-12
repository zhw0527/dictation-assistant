App({
  onLaunch() {
    // 小程序启动时执行
    console.log('听写助理小程序启动')
    
    // 初始化本地存储
    if (!wx.getStorageSync('dictationHistory')) {
      wx.setStorageSync('dictationHistory', [])
    }
  },
  
  globalData: {
    userInfo: null
  }
})
