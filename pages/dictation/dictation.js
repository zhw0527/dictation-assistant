// pages/dictation/dictation.js
const api = require('../../utils/api')
const voiceEvaluation = require('../../utils/voice-evaluation')
const pointsSystem = require('../../utils/points-system')

Page({
  data: {
    wordList: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'], // 示例词汇
    currentIndex: 0,
    currentWord: '',
    userInput: '',
    isStarted: false,
    progress: 0,
    answers: [],
    isPlaying: false,
    // 新增：游戏化数据
    streak: 0,           // 连击数
    totalPoints: 0,      // 总积分
    sessionPoints: 0,    // 本次积分
    startTime: 0,        // 答题开始时间
    // 新增：录音相关
    isRecording: false,
    recordManager: null,
    // 新增：动画状态
    answerAnimation: ''
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

    // 初始化录音管理器
    const recordManager = wx.getRecorderManager()
    this.setData({ recordManager })
    
    recordManager.onStop((res) => {
      this.handleRecordStop(res)
    })

    recordManager.onError((err) => {
      console.error('录音错误:', err)
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      })
      this.setData({ isRecording: false })
    })

    // 加载用户积分
    const userId = 'current_user' // TODO: 替换为真实用户ID
    const stats = pointsSystem.getUserStats(userId)
    this.setData({
      totalPoints: stats.totalPoints
    })
  },

  // 开始听写
  startDictation() {
    this.setData({
      isStarted: true,
      currentIndex: 0,
      answers: [],
      streak: 0,
      sessionPoints: 0
    })
    this.loadWord()
  },

  // 加载当前词汇
  loadWord() {
    const { wordList, currentIndex } = this.data
    if (currentIndex < wordList.length) {
      this.setData({
        currentWord: wordList[currentIndex],
        progress: ((currentIndex + 1) / wordList.length) * 100,
        userInput: '',
        startTime: Date.now() // 记录开始时间
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
    const { currentIndex, wordList, userInput, currentWord, answers, streak, startTime } = this.data
    
    const isCorrect = userInput.trim() === currentWord
    const answerTime = Date.now() - startTime
    
    // 构建答题结果
    const result = {
      isCorrect: isCorrect,
      score: isCorrect ? 100 : 0,
      time: answerTime,
      isVoice: false // TODO: 如果是语音答题则设为 true
    }
    
    // 计算积分
    const userId = 'current_user' // TODO: 替换为真实用户ID
    const points = pointsSystem.calculatePoints(result, streak, 1)
    
    // 更新积分
    const pointsInfo = pointsSystem.updateUserPoints(userId, points)
    
    // 更新连击
    const newStreak = isCorrect ? streak + 1 : 0
    
    // 更新数据
    const sessionPoints = this.data.sessionPoints + points
    
    // 保存答案
    answers.push({
      word: currentWord,
      answer: userInput,
      correct: isCorrect,
      points: points,
      time: answerTime
    })

    this.setData({
      streak: newStreak,
      sessionPoints: sessionPoints,
      totalPoints: pointsInfo.totalPoints,
      answers: answers
    })

    // 显示动画
    this.showAnswerAnimation(isCorrect)
    
    // 显示积分
    if (points > 0) {
      this.showPointsAnimation(points)
    }

    // 显示新成就
    if (pointsInfo.newAchievements && pointsInfo.newAchievements.length > 0) {
      setTimeout(() => {
        pointsInfo.newAchievements.forEach(achievement => {
          pointsSystem.showAchievementNotification(achievement)
        })
      }, 1000)
    }

    // 显示升级
    if (pointsInfo.levelUp) {
      setTimeout(() => {
        pointsSystem.showLevelUpNotification(pointsInfo.levelUp)
      }, 1500)
    }

    // 继续下一个
    setTimeout(() => {
      if (currentIndex < wordList.length - 1) {
        this.setData({
          currentIndex: currentIndex + 1,
          userInput: ''
        })
        this.loadWord()
      } else {
        this.finishDictation()
      }
    }, 800)
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
    const { answers, sessionPoints } = this.data
    const history = wx.getStorageSync('dictationHistory') || []
    history.unshift({
      date: new Date().toLocaleString(),
      answers: answers,
      score: answers.filter(a => a.correct).length,
      points: sessionPoints
    })
    wx.setStorageSync('dictationHistory', history)
  },

  // 新增：开始录音
  startRecord() {
    const { recordManager } = this.data
    this.setData({ isRecording: true })
    
    recordManager.start({
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    })

    wx.showToast({
      title: '开始录音...',
      icon: 'none',
      duration: 1000
    })
  },

  // 新增：停止录音
  stopRecord() {
    const { recordManager } = this.data
    this.setData({ isRecording: false })
    recordManager.stop()
  },

  // 新增：处理录音结果
  async handleRecordStop(res) {
    wx.showLoading({ title: '评测中...' })
    
    try {
      const { currentWord } = this.data
      
      // 调用语音评测
      const result = await voiceEvaluation.evaluate(
        res.tempFilePath,
        currentWord,
        'word'
      )
      
      wx.hideLoading()
      
      // 显示评测结果
      this.showEvaluationResult(result)
      
      // 如果分数达标，自动填入答案
      if (result.score >= 60) {
        this.setData({ userInput: currentWord })
      }
      
    } catch (error) {
      wx.hideLoading()
      console.error('语音评测失败:', error)
      wx.showToast({
        title: '评测失败，请重试',
        icon: 'none'
      })
    }
  },

  // 新增：显示评测结果
  showEvaluationResult(result) {
    const content = `发音评分: ${result.score}分\n准确度: ${result.accuracy}分\n流利度: ${result.fluency}分\n完整度: ${result.completeness}分\n评级: ${result.grade}`
    
    wx.showModal({
      title: '语音评测结果',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  // 新增：显示积分动画
  showPointsAnimation(points) {
    if (points > 0) {
      wx.showToast({
        title: `+${points} 分！`,
        icon: 'none',
        duration: 1500
      })
    }
  },

  // 新增：显示答题动画
  showAnswerAnimation(isCorrect) {
    this.setData({
      answerAnimation: isCorrect ? 'correct-answer' : 'wrong-answer'
    })
    
    setTimeout(() => {
      this.setData({ answerAnimation: '' })
    }, 600)
  }
})
