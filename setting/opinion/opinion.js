// setting/opinion/opinion.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    input:'',//意见反馈内容
    nowNum: 0,//意见反馈字数
    maxNum: 200,//意见反馈最大字数
    icon: true,//点击按钮开关
  },
  //发送意见反馈
  sendInput: function(){
    var _this = this;
    if(this.data.icon){
      this.setData({
        icon: false
      })
      var data = {
        'user_id': app.globalData.user_id,
        'content': this.data.input
      }
      if (!data.content){
        wx.showToast({
          title: '请先输入反馈内容再进行提交',
          icon: 'none'
        })
        return;
      }
      app.callback_Request('/suggestion_save', 'get', data, _this.callback_opinion);
    }
  },
  //意见反馈回调函数
  callback_opinion: function(res){
    var _this = this;
    if(res.data.code == 200){
      wx.showToast({
        title: '提交成功',
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    }else{
      wx.showToast({
        title: '数据异常，请稍后再试',
        icon: 'none'
      })
      this.setData({
        icon: true
      })
    }
  },
  //重新获取用户信息
  callback_getUserInfo: function(res){
    if(res.data.code == 200){
      app.globalData.userInfo = res.data.data.content;
      wx.showToast({
        title: '恭喜您获得三次免费查询的机会',
        icon:'none'
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    }
  },
  //检测意见反馈字数
  checkNum: function(e){
    this.setData({
      nowNum: e.detail.value.length,
      input: e.detail.value
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
    var pages = getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2].route;//上一页面指针 
    var obj = '';
    if (app.globalData.user_id) {
      obj += 'user_id:' + app.globalData.user_id;
    }
    if (obj.length != 0) obj += ',';
    obj += 'prev:' + prepage;
    obj = '{' + obj + '}';
    app.callback_log((app.globalData.phone || 0), 'setting/opinion/opinion', 'show', obj);
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