// pages/dictation/dictation.js
const api = require('../../utils/api')

Page({
  data: {
    wordList: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'], // 示例词汇
    currentIndex: 0,
    currentWord: '',
    userInput: '',
    isStarted: false,
    progress: 0,
    answers: [],
    isPlaying: false
  },

  onLoad(options) {
    // 可以从上一页接收词汇列表
    if (options.words) {
      try {
        const words = JSON.parse(decodeURIComponent(options.words))
        this.setData({ wordList: words })
      } catch (e) {
        console.error('解析词汇列表失败', e)
      }
    }
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
  async playWord() {
    const { currentWord, isPlaying } = this.data
    
    if (isPlaying) {
      wx.showToast({
        title: '正在播放中...',
        icon: 'none'
      })
      return
    }

    this.setData({ isPlaying: true })
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
      // 调用语音合成API
      const audioData = await api.textToSpeech(currentWord)
      
      wx.hideLoading()
      
      // 播放音频
      await api.playAudio(audioData)
      
      this.setData({ isPlaying: false })
    } catch (error) {
      wx.hideLoading()
      this.setData({ isPlaying: false })
      
      console.error('播放失败', error)
      wx.showToast({
        title: '播放失败，请重试',
        icon: 'none'
      })
    }
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
