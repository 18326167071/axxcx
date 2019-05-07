// setting/info/info.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,//个人用户信息
    sex: ['男', '女'],//性别可选项
    pic:'',//头像
    name: '',//昵称
    sexIndex: 0,//性别索引
    mobile: '去绑定',//手机号码
    company: '',//企业名
    job: '',//职位名
    isVip: false,//是否是会员
  },
  //确定修改头像
  endPic: function(){
    var _this = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        app.callback_upload('/user/upload_head_image', res.tempFilePaths[0], 'head_image', _this.callback_uploadPic)
      }
    })
  },
  //确定修改头像回调
  callback_uploadPic: function(res){
    var _this = this;
    var data = {
      user_id: app.globalData.user_id,
      column: 'avatar_url',
      value: res.data
    };
    app.callback_Request('/user/user_edit', 'get', data, _this.callback_endPic)
  },
  //修改头像回调
  callback_endPic: function(res){
    if (res.data.code != 200) {
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
      this.setData({
        pic: this.userInfo.avatar_url
      })
    }else{
      var _this = this;
      var data = {
        user_id: app.globalData.user_id,
        union_id: wx.getStorageSync('union_id'),
        open_id: app.globalData.open_id,
        mobile: ''
      };
      app.callback_Request('/user/user_info', 'get', data, _this.callback_getUserInfo)
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'pic:true';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'setting/info/info', 'tap', obj);
    }
  },
  //确定修改名字
  endName: function(e){
    if (!e.detail.value){
      return;
    }
    var _this = this;
    var data = {
      user_id: app.globalData.user_id,
      column: 'nickname',
      value: e.detail.value
    };
    this.setData({
      name: e.detail.value
    })
    app.callback_Request('/user/user_edit', 'get', data, _this.callback_endName)
  },
  //修改名字回调
  callback_endName: function(res){
    if(res.data.code != 200){
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
      this.setData({
        name: this.userInfo.nickname
      })
    }else{
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'name:true';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'setting/info/info', 'tap', obj);
    }
  },
  //确定修改性别
  endSex: function(e){
    var _this = this;
    var data = {
      user_id: app.globalData.user_id,
      column: 'gender',
      value: parseInt(e.detail.value) + 1
    };
    this.setData({
      sexIndex: e.detail.value
    })
    app.callback_Request('/user/user_edit', 'get', data, _this.callback_endSex)
  },
  //修改性别回调
  callback_endSex: function (res) {
    if (res.data.code != 200) {
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
      this.setData({
        sexIndex: this.data.userInfo.gender - 1,
      })
    }else{
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'sex:true';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'setting/info/info', 'tap', obj);
    }
  },
  //没有手机号时去绑定手机号
  startMobile: function(){
    if(this.data.mobile == "去绑定"){
      wx.navigateTo({
        url: '/login/login/login',
      })
    }
  },
  //确定修改公司名
  endEnterpriseName: function (e) {
    var _this = this;
    var data = {
      user_id: app.globalData.user_id,
      column: 'enterprise_name',
      value: e.detail.value
    };
    this.setData({
      company: e.detail.value
    })
    app.callback_Request('/user/user_edit', 'get', data, _this.callback_endEnterpriseName)
  },
  //修改公司名回调
  callback_endEnterpriseName: function (res) {
    if (res.data.code != 200) {
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
      this.setData({
        company: this.data.userInfo.enterprise_name,
      })
    }else{
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'company:true';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'setting/info/info', 'tap', obj);
    }
  },
  //确定修改职位名
  endJobName: function (e) {
    var _this = this;
    var data = {
      user_id: app.globalData.user_id,
      column: 'job_name',
      value: e.detail.value
    };
    this.setData({
      job: e.detail.value
    })
    app.callback_Request('/user/user_edit', 'get', data, _this.callback_endJobName)
  },
  //修改公司名回调
  callback_endJobName: function (res) {
    if (res.data.code != 200) {
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
      this.setData({
        job: this.data.userInfo.job_name,
      })
    }else{
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'job:true';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'setting/info/info', 'tap', obj);
    }
  },
  //获取用户个人信息
  callback_getUserInfo: function(res){
    if (res.data.code == 200) {
      this.setData({
        userInfo: res.data.data.content,
        pic: res.data.data.content.avatar_url,
        name: res.data.data.content.nickname,
        sexIndex: res.data.data.content.gender - 1,
        mobile: res.data.data.content.mobile || '去绑定',
        company: res.data.data.content.enterprise_name,
        job: res.data.data.content.job_name,
        isVip: res.data.data.content.is_vip
      })
    }
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
    var pages = getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2].route;//上一页面指针 
    var obj = '';
    if (app.globalData.user_id) {
      obj += 'user_id:' + app.globalData.user_id;
    }
    if (obj.length != 0) obj += ',';
    obj += 'prev:' + prepage;
    obj = '{' + obj + '}';
    app.callback_log((app.globalData.phone || 0), 'setting/info/info', 'show', obj);
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