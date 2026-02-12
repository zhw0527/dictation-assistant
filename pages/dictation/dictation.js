// pages/dictation/dictation.js
Page({
  data: {
    wordList: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'], // 示例词汇
    currentIndex: 0,
    currentWord: '',
    userInput: '',
    isStarted: false,
    progress: 0,
    answers: []
  },

  onLoad() {
    // 可以从上一页接收词汇列表
  },

  // 开始听写
  startDictation() {
    this.setData({
      isStarted: true,
      currentIndex: 0,
      answers: []
    })
    this.loadWord()
  },

  // 加载当前词汇
  loadWord() {
    const { wordList, currentIndex } = this.data
    if (currentIndex < wordList.length) {
      this.setData({
        currentWord: wordList[currentIndex],
        progress: ((currentIndex + 1) / wordList.length) * 100
      })
      // 自动播放
      this.playWord()
    }
  },

  // 播放词汇
  playWord() {
    const { currentWord } = this.data
    wx.showToast({
      title: `播放: ${currentWord}`,
      icon: 'none'
    })
    // TODO: 集成语音播报API
  },

  // 输入内容
  onInput(e) {
    this.setData({
      userInput: e.detail.value
    })
  },

  // 下一个词汇
  nextWord() {
    const { currentIndex, wordList, userInput, currentWord, answers } = this.data
    
    // 保存答案
    answers.push({
      word: currentWord,
      answer: userInput,
      correct: userInput === currentWord
    })

    if (currentIndex < wordList.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1,
        userInput: '',
        answers
      })
      this.loadWord()
    } else {
      this.finishDictation()
    }
  },

  // 完成听写
  finishDictation() {
    const { answers } = this.data
    const correctCount = answers.filter(a => a.correct).length
    
    wx.showModal({
      title: '听写完成',
      content: `正确: ${correctCount}/${answers.length}`,
      success: (res) => {
        if (res.confirm) {
          // 保存到历史记录
          this.saveToHistory()
          wx.navigateBack()
        }
      }
    })
  },

  // 保存到历史记录
  saveToHistory() {
    const { answers } = this.data
    const history = wx.getStorageSync('dictationHistory') || []
    history.unshift({
      date: new Date().toLocaleString(),
      answers: answers,
      score: answers.filter(a => a.correct).length
    })
    wx.setStorageSync('dictationHistory', history)
  }
})
