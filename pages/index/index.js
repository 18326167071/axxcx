var bmap = require('../../utils/bmap-wx.min.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num:{
      company: '',
      success: '',
      personal: '',
      today: ''
    },//头部各类数据总数
    loginPop: false,//授权弹窗是否弹出
    list: [],//首页企业推荐
    iconList: [],//首页图标列表
    ak:'UFY9tWnmWMkndpj2cyA6qrBQvYP42CGP',//百度地图ak
    isVip: false,//是否领取会员卡
    phone:'',//存手机号
    icon: true,//点击按钮开关
    isDoneVip: false,//会员卡是否已过期
  },
  goBaidu: function(){
  },
  //检查是否登录，未登录跳出授权弹窗
  checkLogin: function () {
    if (!app.globalData.phone) {
      this.setData({
        loginPop: true
      })
    }
  },
  //检查列表-企业推荐列表详情
  goDetail: function (e) {
    if(this.data.icon){
      this.checkLogin();
      this.setData({
        icon: false
      })
      if (!this.data.loginPop) {
        app.globalData.companyList.company = e.currentTarget.dataset.name
        wx.navigateTo({
          url: '/company/detail/detail',
        })
      }
    }
  },
  //去资质搜索页面
  goCompanySearch: function(){
    if(this.data.icon){
      this.checkLogin();
      this.setData({
        icon: false
      })
      if (!this.data.loginPop) {
        wx.navigateTo({
          url: '/company/search/search',
        })
      }

      //埋点
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'next:searchInput';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'pages/index/index', 'tap', obj);
    }
  },
  //去其他界面
  goOther: function(e){
    if(this.data.icon){
      this.checkLogin();
      this.setData({
        icon: false
      })
      if (!this.data.loginPop) {
        //埋点
        var obj = '';
        if (app.globalData.user_id) {
          obj += 'user_id:' + app.globalData.user_id;
        }
        if (obj.length != 0) obj += ',';
        obj += 'next:' + e.currentTarget.dataset.route;
        obj = '{' + obj + '}';
        app.callback_log((app.globalData.phone || 0), 'pages/index/index', 'tap', obj);
        console.log(e.currentTarget.dataset.route);
        //按照跳转方式跳转不同页面
        if (e.currentTarget.dataset.route == 'search/search/search') {
          //组合查询
          wx.switchTab({
            url: '/search/search/search',
          })
        } else if (e.currentTarget.dataset.route == 'none') {
          //敬请期待
          wx.showToast({
            title: '敬请期待',
            icon: 'none'
          })
          this.setData({
            icon: true
          })
        } else if (e.currentTarget.dataset.route.indexOf('list') != -1) {
          //曝光台
          wx.navigateTo({
            url: '/' + e.currentTarget.dataset.route,
          })
        } else {
          //差资质、业绩、人员、诚信、招标公告
          wx.navigateTo({
            url: '/' + e.currentTarget.dataset.route,
          })
        }
      }
    }
  },
  //首次登陆获取微信授权
  getPhoneNumber(e){
    var _this = this;
    if(this.data.icon){
      this.setData({
        icon: false
      })
      if (e.detail.encryptedData) {
        //授权
        //encryptedData 包括敏感数据在内的完整用户信息的加密数据
        this.setData({
          loginPop: false
        })
        var data = {
          'sessionKey': app.globalData.session_key,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv
        }
        //解密用户信息
        app.callback_Request('/user/decrypt', 'get', data, _this.callback_info);
      } else {
        //取消授权
        this.setData({
          loginPop: false
        })
        wx.navigateTo({
          url: '/login/login/login',
        })
      }
    }
  },
  //首次登录获取微信授权设置unionId
  callback_info(res){
    var _this = this;
    this.setData({
      phone: res.data.data.content.phoneNumber
    })
    if(res.data.code == 200){
      app.globalData.phone = res.data.data.content.phoneNumber
      var data = {
        user_id: '',
        union_id: '',
        open_id: '',
        mobile: res.data.data.content.phoneNumber
      };
      //获取用户信息
      app.callback_Request('/user/user_info', 'get', data, _this.callback_checkPhone)
    }
  },
  //通过手机号判断是否是我们用户
  callback_checkPhone: function(res){
    var _this = this;
    if (res.data.code == 500 && res.data.data.message == "此用户不存在"){
      var data = {
        user_id: app.globalData.user_id,
        column: 'mobile',
        value: this.data.phone
      };
      //编辑用户信息
      app.callback_Request('/user/user_edit', 'get', data, _this.callback_bindPhone)
    }else{
      wx.showToast({
        title: '该手机号已注册账号，请更换手机号',
        icon: 'none'
      })
    }
  },
  //绑定手机号的回调
  callback_bindPhone: function(res){
    var _this = this;
    if(res.data.code == 200){
      this.setData({
        loginPop: false
      })
      wx.showToast({
        title: '绑定成功'
      })
    }else{
      wx.showToast({
        title: '绑定失败，请稍后重试',
        icon: 'none'
      })
    }
  },
  //去绑定手机号
  goBind: function(){
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
  callback_getUserInfo(res){
    var _this = this;
    if (res.data.code == 500 && res.data.data.message == "此用户不存在"){
      var data = {
        union_id: app.globalData.union_id || '',
        open_id: app.globalData.open_id || '',
        source: 1
      }
      data.union_id ? data.union_id : delete data.union_id;
      app.callback_Request('/user/save', 'get', data, _this.callback_Register)
    }else if(res.data.code == 200){
      app.globalData.user_id = res.data.data.content.id;
      app.globalData.phone = res.data.data.content.mobile;
      app.globalData.userInfo = res.data.data.content;
      //判断有无手机号
      if (!res.data.data.content.mobile){
        this.setData({
          loginPop: true
        })
      }else{
        this.setData({
          loginPop: false
        })
      }
      if (res.data.data.content.not_alert_cards.length!=0){
        this.setData({
          isVip: true
        })
        var data = {
          user_id: app.globalData.user_id,
          card_type: res.data.data.content.not_alert_cards[0].card_type,
          activity_type: res.data.data.content.not_alert_cards[0].activity_type
        }
        //更改卡券状态为已提示
        app.callback_Request('/card_edit', 'get', data, _this.callback_userCard)
      }
      var data = {
        user_id: app.globalData.user_id
      }
      app.callback_Request('/AllTotals/GetAllTotals', 'get', data, _this.callback_total);
      var BMap = new bmap.BMapWX({
        ak: _this.data.ak
      });
      BMap.regeocoding({
        fail: function (err) {
          var data = { page_size: 15, user_id: app.globalData.user_id };
          //推荐企业列表
          app.callback_Request('/enterprise_recommend_list', 'get', data, _this.callback_getList);
        },
        success: function (res) {
          _this.setData({
            area: res.originalData.result.addressComponent.province
          })
          var data = { page_size: 15, search: '{RegAddr:"' + _this.data.area + '"}', user_id: app.globalData.user_id };
          app.callback_Request('/enterprise_recommend_list', 'get', data, _this.callback_getList);
        }
      });
      //会员已过期弹窗只弹窗一次
      wx.getStorage({
        key: 'done',
        fail: function(err){
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
  callback_userCard: function (res) { },
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
  //获取推荐企业列表的回调
  callback_getList: function (res) {
    this.setData({
      list: res.data.data.list
    })
  },
  //获取首页图标列表回调
  callback_getIconList: function(res){
    this.setData({
      iconList: res.data.data.list
    })
  },
  //首页获取数据总数
  callback_total: function(res){
    var num = {};
    res.data.enterpriseCount > 10000 ? num.company = parseInt(res.data.enterpriseCount/10000) : num.company;
    res.data.projectCount > 10000 ? num.success = parseInt(res.data.projectCount / 10000) : num.success;
    res.data.personCount > 10000 ? num.personal = parseInt(res.data.personCount / 10000) : num.personal;
    res.data.updateCount > 10000 ? num.today = parseInt(res.data.updateCount / 10000) : num.today;
    this.setData({
      num: num
    })
  },
  //去我的礼卷
  goCard: function(){
    var str = '{"user_id":"' + app.globalData.user_id + '",next":"/setting/card/card"}';
    app.callback_log((app.globalData.phone || 0), 'pages/index/index', 'tap', str);
    if(this.data.icon){
      this.setData({
        isVip: false,
        icon: false
      })
      wx.navigateTo({
        url: '/setting/card/card',
      })
    }
  },
  //关闭vip弹窗
  closeVip: function(){
    var str = '{"user_id":"' + app.globalData.user_id + '"}';
    app.callback_log((app.globalData.phone || 0), 'pages/index/index', 'tap', str);
    this.setData({
      isVip: false
    })
  },
  //关闭Vip已使用弹窗
  closeDoneVip: function(){
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
    if(app.globalData.open_id){
      var data = {
        user_id: '',
        union_id: app.globalData.union_id || '',
        open_id: app.globalData.open_id,
        mobile: ''
      };
      //获取用户信息
      app.callback_Request('/user/user_info', 'get', data, _this.callback_getUserInfo)
      var data = {};
      //分类列表
      app.callback_Request('/category_list', 'get', data, _this.callback_getIconList);
    }else{
      app.useGlobalDataCallback = function (res) {
        var data = {
          user_id: '',
          union_id: app.globalData.union_id || '',
          open_id: app.globalData.open_id,
          mobile: ''
        };
        app.callback_Request('/user/user_info', 'get', data, _this.callback_getUserInfo)
        var data = {};
        app.callback_Request('/category_list', 'get', data, _this.callback_getIconList);
      }
    }
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