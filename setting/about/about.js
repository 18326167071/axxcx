// setting/about/about.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    icon: true,//点击按钮开关
  },
  //去功能介绍页面
  goDescription: function(){
    if(this.data.icon){
      wx.navigateTo({
        url: '/setting/description/description',
      })
      this.setData({
        icon: false
      })
    }
  },
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      'phoneNumber': e.currentTarget.dataset.phone
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
    app.callback_log((app.globalData.phone || 0), 'setting/about/about', 'show', obj);
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