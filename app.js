//app.js
var util = require('/utils/util.js');
var time = require('/utils/time.js');
App({
  onLaunch: function () {
    var _this = this;
    // 登录
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code){
          _this.globalData.code = res.code;
          var data = { code: res.code };
          _this.callback_Request('/user/get_session_key', 'get', data, _this.callback_login);
        }
      },
      fail: function(err){
        console.log(err)
      }
    })
  },
  //登陆成功后回调记录基本信息
  callback_login: function(res){
    this.globalData.union_id = res.data.data.list.res.unionid;
    this.globalData.authentication = res.data.data.list.authentication;
    this.globalData.session_key = res.data.data.list.res.session_key;
    this.globalData.open_id = res.data.data.list.res.openid;
    //微信登录是网络请求，可能会在 Page.onLoad 之后才返回
    //所以此处加入 callback 以防止这种情况
    if (this.useGlobalDataCallback){
      this.useGlobalDataCallback(res)
    }
  },
  //全局定义有回调请求
  callback_Request: function (path, method, data, callback) {
    data.code = this.globalData.code;
    data.authentication = this.globalData.authentication;
    wx.request({
      url: util.apiUrl + path,
      method: method,
      header: {
        'content-type': 'application/json',
      },
      data: data,
      success: function (res) {
        callback(res)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //全局定义埋点
  callback_log: function (phone, route, event, eventContent) {
    wx.request({
      url: util.apiUrl + '/UserLogs/UserLogsInsert',
      method: 'post',
      header: {
        'content-type': 'application/json',
      },
      data: {
        'Sourcesite':'鲸查',
        'PhoneNo': phone,
        'Route': route,
        'Event': event,
        'EventContent': eventContent,
        'code': this.globalData.code,
        'authentication': this.globalData.authentication,
      }
    })
  },
  //上传图片的回调
  callback_upload: function (url, path, name, callback) {
    wx.uploadFile({
      url: util.apiUrl + url,
      filePath: path,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        code: this.globalData.code,
        authentication: this.globalData.authentication
      },
      success: function(res){
        callback(res)
      },
      fail: function(err){
        console.log(err)
      }
    })
  },
  nowTime: time.nowTime,
  globalData: {
    userInfo: {},//用户信息
    code: '',//验证code
    authentication: '',//验证authentication
    session_key: '',//用户session_key
    user_id: '',//用户user_id
    open_id: '',//用户open_id
    apiUrl: util.apiUrl,//项目api地址
    phone:'',//人员电话
    companyList:{},//公司搜索项
    company:{},//公司详情
    projectList:{},//业绩搜索项
    project:{},//项目详情
    personList:{},//人员搜索项
    person:{},//人员详情
    noticeList:{},//招投标搜索项
    noticeId:'',//招投标id
    creditList:{},//诚信搜索项
    credit:{},//诚信详情
    black:{},//黑名单详情
    discreditList: [],//存疑名单列表
    discredit: {},//存疑名单详情
    discreditData: [],//存疑名单搜索项
  }
})