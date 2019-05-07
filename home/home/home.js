// home/home/home.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,//用户基本信息
    loginPop: false,//授权弹窗是否弹出
    list:[
      { icon: '/static/icon/home_card.png', text: '我的礼劵', type: 'card' },
      { icon: '/static/icon/home_collect.png', text: '我的收藏', type: 'star'},
      { icon: '/static/icon/home_opinion.png', text: '意见反馈', type: 'opinion'},
      { icon: '/static/icon/home_about.png', text: '关于我们', type: 'about'}
    ],//我的页面操作列表
    isVip: false,//是否领取会员卡
    phone: '',//存手机号
    icon: true,//点击按钮开关
    isDoneVip: false,//会员卡是否已过期
  },
  //检查是否登录，未登录跳出授权弹窗
  checkLogin: function(){
    if (!app.globalData.phone && !this.data.phone){
      this.setData({
        loginPop: true
      })
    }
  },
  //首次登陆获取微信授权
  getPhoneNumber(e) {
    var _this = this;
    if (e.detail.encryptedData) {
      this.setData({
        loginPop: false
      })
      var data = {
        'sessionKey': app.globalData.session_key,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv
      }
      app.callback_Request('/user/decrypt', 'get', data, _this.callback_info);
    } else {
      this.setData({
        loginPop: false
      })
      wx.navigateTo({
        url: '/login/login/login',
      })
    }
  },
  //首次登录获取微信授权设置unionId
  callback_info(res) {
    var _this = this;
    this.setData({
      phone: res.data.data.content.phoneNumber
    })
    if (res.data.code == 200) {
      app.globalData.phone = res.data.data.content.phoneNumber;
      var data = {
        user_id: '',
        union_id: '',
        open_id: '',
        mobile: res.data.data.content.phoneNumber
      };
      app.callback_Request('/user/user_info', 'get', data, _this.callback_checkPhone)
    }
  },
  //通过手机号判断是否是我们用户
  callback_checkPhone: function (res) {
    var _this = this;
    if (res.data.code == 500 && res.data.data.message == "此用户不存在") {
      var data = {
        user_id: app.globalData.user_id,
        column: 'mobile',
        value: this.data.phone
      };
      app.callback_Request('/user/user_edit', 'get', data, _this.callback_bindPhone)
    } else {
      wx.showToast({
        title: '该手机号已注册账号，请更换手机号',
        icon: 'none'
      })
    }
  },
  //绑定手机号的回调
  callback_bindPhone: function (res) {
    var _this = this;
    if (res.data.code == 200) {
      this.setData({
        loginPop: false
      })
      wx.showToast({
        title: '绑定成功'
      })
    } else {
      wx.showToast({
        title: '绑定失败，请稍后重试',
        icon: 'none'
      })
    }
  },
  //去绑定手机号
  goBind: function () {
    if(this.data.icon){
      this.setData({
        loginPop: false,
        icon: false   
      })
      wx.navigateTo({
        url: '/login/login/login',
      })
    }
  },
  //获取当前登录人信息
  callback_getUserInfo(res) {
    var _this = this;
    if (res.data.code == 500 && res.data.data.message == "此用户不存在") {
      var data = {
        union_id: app.globalData.union_id || '',
        open_id: app.globalData.open_id || '',
        source: 1
      }
      data.union_id ? data.union_id : delete data.union_id;
      app.callback_Request('/user/save', 'get', data, _this.callback_Register)
    } else if (res.data.code == 200) {
      this.setData({
        userInfo: res.data.data.content
      })
      app.globalData.user_id = res.data.data.content.id;
      app.globalData.phone = res.data.data.content.mobile;
      app.globalData.userInfo = res.data.data.content;
      if (!res.data.data.content.mobile) {
        this.setData({
          loginPop: true
        })
      } else {
        this.setData({
          loginPop: false
        })
      }
      if (res.data.data.content.not_alert_cards.length != 0) {
        this.setData({
          isVip: true
        })
        var data = {
          user_id: app.globalData.user_id,
          card_type: res.data.data.content.not_alert_cards[0].card_type,
          activity_type: res.data.data.content.not_alert_cards[0].activity_type
        }
        app.callback_Request('/card_edit', 'get', data, _this.callback_userCard)
      }
      wx.getStorage({
        key: 'done',
        fail: function (err) {
          if (!app.globalData.userInfo.is_vip && app.globalData.userInfo.end_time) {
            _this.setData({
              isDoneVip: true
            })
            wx.setStorage({
              key: 'done',
              data: '1',
            })
          }
        }
      })
    }
  },
  //标记已使用会员卡
  callback_userCard: function(res){},
  //注册用户回调函数
  callback_Register: function (res) {
    var _this = this;
    if (res.data.code == 200) {
      var data = {
        user_id: '',
        union_id: app.globalData.union_id || '',
        open_id: app.globalData.open_id,
        mobile: ''
      };
      app.callback_Request('/user/user_info', 'get', data, _this.callback_getUserInfo)
    }
  },
  //点击设置列表项
  setting: function (e) {
    this.checkLogin();
    if (!this.data.loginPop){
      var str = e.currentTarget.dataset.type;
      if (this.data.icon) {
        wx.navigateTo({
          url: '/setting/' + str + '/' + str,
        })
        this.setData({
          icon: false
        })
      }
    }
  },
  //跳转到个人信息页面
  getInfo: function () {
    if (this.data.icon) {
      wx.navigateTo({
        url: '/setting/info/info'
      })
      this.setData({
        icon: false
      })
    }
  },
  //去我的礼卷
  goCard: function () {
    var str = '{"user_id":"' + app.globalData.user_id + '",next":"/setting/card/card"}';
    app.callback_log((app.globalData.phone || 0), 'home/home/home', 'tap', str);
    this.setData({
      isVip: false
    })
    if (this.data.icon) {
      wx.navigateTo({
        url: '/setting/card/card',
      })
      this.setData({
        icon: false
      })
    }
  },
  //关闭vip弹窗
  closeVip: function () {
    var str = '{"user_id":"' + app.globalData.user_id + '"}';
    app.callback_log((app.globalData.phone || 0), 'home/home/hpme', 'tap', str);
    this.setData({
      isVip: false
    })
  },
  //关闭Vip已使用弹窗
  closeDoneVip: function () {
    this.setData({
      isDoneVip: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    var data = {
      user_id: '',
      union_id: app.globalData.union_id || '',
      open_id: app.globalData.open_id,
      mobile: ''
    };
    app.callback_Request('/user/user_info', 'get', data, _this.callback_getUserInfo)
    this.setData({
      icon: true
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})