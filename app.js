App({
  onLaunch() {
    // 小程序启动时执行
    console.log('听写助理小程序启动')
    
    // 初始化本地存储
    if (!wx.getStorageSync('dictationHistory')) {
      wx.setStorageSync('dictationHistory', [])
    }

    // 捕获全局错误
    wx.onError((error) => {
      // 忽略微信开发者工具的内部错误
      if (error.includes('webapi_getwxaasyncsecinfo')) {
        return
      }
      console.error('全局错误:', error)
    })
  },
  
  globalData: {
    userInfo: null
  }
})
