// pages/correction/correction.js
Page({
  data: {
    report: null,
    showDetail: false
  },

  onLoad(options) {
    // 从上一页接收批改报告
    if (options.report) {
      try {
        const report = JSON.parse(decodeURIComponent(options.report))
        this.setData({ report })
      } catch (e) {
        console.error('解析报告失败', e)
      }
    }
  },

  // 切换详情显示
  toggleDetail() {
    this.setData({
      showDetail: !this.data.showDetail
    })
  },

  // 查看错题详情
  viewWrongAnswer(e) {
    const index = e.currentTarget.dataset.index
    const wrongAnswer = this.data.report.wrongAnswers[index]

    let content = `标准答案：${wrongAnswer.standardAnswer}\n你的答案：${wrongAnswer.userAnswer || '未作答'}`

    if (wrongAnswer.analysis) {
      content += `\n\n错误类型：${wrongAnswer.analysis.errorType}`
      content += `\n建议：${wrongAnswer.analysis.suggestion}`

      if (wrongAnswer.analysis.similarChars && wrongAnswer.analysis.similarChars.length > 0) {
        content += '\n\n形近字提示：'
        wrongAnswer.analysis.similarChars.forEach(item => {
          content += `\n${item.tip}`
        })
      }
    }

    wx.showModal({
      title: `第 ${wrongAnswer.index} 题`,
      content: content,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 重新听写错题
  retryWrongAnswers() {
    const wrongWords = this.data.report.wrongAnswers.map(item => item.standardAnswer)
    
    if (wrongWords.length === 0) {
      wx.showToast({
        title: '没有错题',
        icon: 'success'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/dictation/dictation?words=${encodeURIComponent(JSON.stringify(wrongWords))}`
    })
  },

  // 返回首页
  backToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
