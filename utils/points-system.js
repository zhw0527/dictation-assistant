/**
 * 积分系统
 * 参考小猿口算的游戏化设计
 */
class PointsSystem {
  constructor() {
    // 积分配置
    this.POINTS_CONFIG = {
      CORRECT_ANSWER: 10,      // 答对基础分
      PERFECT_SCORE: 20,       // 完美答案额外分
      SPEED_BONUS: 5,          // 快速答题奖励
      STREAK_MULTIPLIER: 2,    // 连击倍数
      FIRST_TRY: 15,          // 一次答对奖励
      VOICE_BONUS: 10         // 语音答题奖励
    }

    // 成就配置
    this.ACHIEVEMENTS = [
      { id: 'beginner', name: '初学者', points: 100, icon: '🌱', desc: '获得100积分' },
      { id: 'learner', name: '学习者', points: 300, icon: '📚', desc: '获得300积分' },
      { id: 'intermediate', name: '进阶者', points: 500, icon: '🌿', desc: '获得500积分' },
      { id: 'skilled', name: '熟练者', points: 800, icon: '🎯', desc: '获得800积分' },
      { id: 'advanced', name: '高手', points: 1000, icon: '🌳', desc: '获得1000积分' },
      { id: 'expert', name: '专家', points: 2000, icon: '💎', desc: '获得2000积分' },
      { id: 'master', name: '大师', points: 5000, icon: '🏆', desc: '获得5000积分' },
      { id: 'legend', name: '传奇', points: 10000, icon: '👑', desc: '获得10000积分' }
    ]

    // 等级配置
    this.LEVELS = [
      { level: 1, name: '青铜', minPoints: 0, maxPoints: 99, color: '#CD7F32' },
      { level: 2, name: '白银', minPoints: 100, maxPoints: 299, color: '#C0C0C0' },
      { level: 3, name: '黄金', minPoints: 300, maxPoints: 499, color: '#FFD700' },
      { level: 4, name: '铂金', minPoints: 500, maxPoints: 799, color: '#E5E4E2' },
      { level: 5, name: '钻石', minPoints: 800, maxPoints: 1999, color: '#B9F2FF' },
      { level: 6, name: '大师', minPoints: 2000, maxPoints: 4999, color: '#9370DB' },
      { level: 7, name: '王者', minPoints: 5000, maxPoints: Infinity, color: '#FF4500' }
    ]
  }

  /**
   * 计算得分
   * @param {Object} result - 答题结果
   * @param {boolean} result.isCorrect - 是否正确
   * @param {number} result.score - 评分（0-100）
   * @param {number} result.time - 用时（毫秒）
   * @param {boolean} result.isVoice - 是否语音答题
   * @param {number} streak - 当前连击数
   * @param {number} attempts - 尝试次数
   * @returns {number} 获得的积分
   */
  calculatePoints(result, streak = 0, attempts = 1) {
    let points = 0
    
    if (!result.isCorrect) {
      return 0
    }
    
    // 基础分
    points += this.POINTS_CONFIG.CORRECT_ANSWER
    
    // 完美分数奖励
    if (result.score >= 95) {
      points += this.POINTS_CONFIG.PERFECT_SCORE
    }
    
    // 速度奖励（5秒内完成）
    if (result.time && result.time < 5000) {
      points += this.POINTS_CONFIG.SPEED_BONUS
    }
    
    // 连击奖励
    if (streak > 0) {
      const streakBonus = Math.min(streak * this.POINTS_CONFIG.STREAK_MULTIPLIER, 50)
      points += streakBonus
    }
    
    // 一次答对奖励
    if (attempts === 1) {
      points += this.POINTS_CONFIG.FIRST_TRY
    }

    // 语音答题奖励
    if (result.isVoice) {
      points += this.POINTS_CONFIG.VOICE_BONUS
    }
    
    return points
  }

  /**
   * 更新用户积分
   * @param {string} userId - 用户ID
   * @param {number} points - 新增积分
   * @returns {Object} 更新后的积分信息
   */
  updateUserPoints(userId, points) {
    const currentPoints = this.getUserPoints(userId)
    const newPoints = currentPoints + points
    
    wx.setStorageSync(`user_points_${userId}`, newPoints)
    
    // 检查是否解锁新成就
    const newAchievements = this.checkAchievements(userId, newPoints)
    
    // 检查是否升级
    const levelUp = this.checkLevelUp(userId, currentPoints, newPoints)
    
    return {
      totalPoints: newPoints,
      addedPoints: points,
      newAchievements: newAchievements,
      levelUp: levelUp
    }
  }

  /**
   * 获取用户积分
   */
  getUserPoints(userId) {
    return wx.getStorageSync(`user_points_${userId}`) || 0
  }

  /**
   * 检查成就
   */
  checkAchievements(userId, totalPoints) {
    const unlockedAchievements = wx.getStorageSync(`achievements_${userId}`) || []
    const newAchievements = []
    
    this.ACHIEVEMENTS.forEach(achievement => {
      if (totalPoints >= achievement.points && 
          !unlockedAchievements.includes(achievement.id)) {
        // 解锁新成就
        unlockedAchievements.push(achievement.id)
        newAchievements.push(achievement)
      }
    })
    
    if (newAchievements.length > 0) {
      wx.setStorageSync(`achievements_${userId}`, unlockedAchievements)
    }
    
    return newAchievements
  }

  /**
   * 检查是否升级
   */
  checkLevelUp(userId, oldPoints, newPoints) {
    const oldLevel = this.getUserLevel(oldPoints)
    const newLevel = this.getUserLevel(newPoints)
    
    if (newLevel.level > oldLevel.level) {
      return newLevel
    }
    
    return null
  }

  /**
   * 获取用户等级
   */
  getUserLevel(totalPoints) {
    return this.LEVELS.find(l => 
      totalPoints >= l.minPoints && totalPoints <= l.maxPoints
    ) || this.LEVELS[0]
  }

  /**
   * 获取用户统计数据
   */
  getUserStats(userId) {
    const totalPoints = this.getUserPoints(userId)
    const level = this.getUserLevel(totalPoints)
    const unlockedAchievements = wx.getStorageSync(`achievements_${userId}`) || []
    
    // 计算到下一级的进度
    const nextLevel = this.LEVELS.find(l => l.level === level.level + 1)
    let progress = 0
    if (nextLevel) {
      const currentLevelPoints = totalPoints - level.minPoints
      const levelRange = nextLevel.minPoints - level.minPoints
      progress = Math.round((currentLevelPoints / levelRange) * 100)
    } else {
      progress = 100 // 已达到最高等级
    }
    
    return {
      totalPoints: totalPoints,
      level: level,
      nextLevel: nextLevel,
      progress: progress,
      achievementsCount: unlockedAchievements.length,
      totalAchievements: this.ACHIEVEMENTS.length
    }
  }

  /**
   * 获取排行榜数据
   * @param {string} type - 排行榜类型：daily/weekly/all
   * @param {number} limit - 返回数量
   */
  getRankingList(type = 'all', limit = 50) {
    // TODO: 从服务器获取排行榜数据
    // 这里暂时返回本地模拟数据
    return []
  }

  /**
   * 显示成就通知
   */
  showAchievementNotification(achievement) {
    wx.showModal({
      title: '🎉 解锁新成就',
      content: `${achievement.icon} ${achievement.name}\n${achievement.desc}`,
      showCancel: false,
      confirmText: '太棒了'
    })
  }

  /**
   * 显示升级通知
   */
  showLevelUpNotification(level) {
    wx.showModal({
      title: '🎊 恭喜升级',
      content: `你已升级到 ${level.name} 段位！\n继续加油！`,
      showCancel: false,
      confirmText: '继续努力'
    })
  }
}

module.exports = new PointsSystem()
