// pages/ranking/ranking.js
const pointsSystem = require('../../utils/points-system')

Page({
  data: {
    currentTab: 'daily',
    rankingList: [],
    myRank: 0,
    myPoints: 0,
    loading: false
  },

  onLoad() {
    this.loadRanking()
    this.loadMyRank()
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.loadRanking()
  },

  // 加载排行榜数据
  async loadRanking() {
    this.setData({ loading: true })

    try {
      const { currentTab } = this.data
      
      // TODO: 从服务器获取真实排行榜数据
      // 这里使用模拟数据
      const mockData = this.getMockRankingData(currentTab)
      
      this.setData({
        rankingList: mockData,
        loading: false
      })
    } catch (error) {
      console.error('加载排行榜失败:', error)
      this.setData({ loading: false })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  },

  // 加载我的排名
  loadMyRank() {
    const userId = 'current_user'
    const stats = pointsSystem.getUserStats(userId)
    
    // TODO: 从服务器获取真实排名
    this.setData({
      myPoints: stats.totalPoints,
      myRank: 42 // 模拟排名
    })
  },

  // 获取模拟排行榜数据
  getMockRankingData(type) {
    const names = [
      '小明', '小红', '小刚', '小丽', '小华',
      '小强', '小芳', '小军', '小梅', '小龙',
      '小雪', '小云', '小风', '小雨', '小天',
      '小月', '小星', '小阳', '小光', '小辉'
    ]

    const avatars = [
      'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLL4JKIbeVWxB2EKLnicJZricXqnLicBzqibibuYfBicBnvibvJXqWKxDPBHKFWtJibkdnKfLSGONJKH9nXfA/132'
    ]

    const basePoints = type === 'daily' ? 500 : type === 'weekly' ? 2000 : 5000
    
    return names.slice(0, 20).map((name, index) => ({
      id: `user_${index}`,
      name: name,
      avatar: avatars[index % 2],
      points: basePoints - index * 50,
      rank: index + 1
    }))
  },

  // 查看用户详情
  viewUserDetail(e) {
    const userId = e.currentTarget.dataset.userId
    // TODO: 跳转到用户详情页
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
})
