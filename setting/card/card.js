// setting/card/card.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,//当前页
    cardList: [],//礼劵列表
    totalPage: 1,//总页数
    showBottom: false,//显示没有数据
  },
  //获取列表的回调
  callback_getList: function(res){
    if(res.data.code == 200){
      wx.hideLoading();
      this.setData({
        totalPage: res.data.data.totalPage,
        cardList: res.data.data.list
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
      page: 1,
      user_id: app.globalData.user_id
    }
    wx.showLoading({
      title: '正在加载',
    })
    app.callback_Request('/card_list', 'get', data, _this.callback_getList)
    //埋点
    var pages = getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2].route;//上一页面指针 
    var obj = '';
    if (app.globalData.user_id) {
      obj += 'user_id:' + app.globalData.user_id;
    }
    if (obj.length != 0) obj += ',';
    obj += 'prev:' + prepage;
    obj = '{' + obj + '}';
    app.callback_log((app.globalData.phone || 0), 'setting/card/card', 'show', obj);
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
  onReachBottom: function () {
    var _this = this;
    if (this.data.currentPage >= this.data.totalPage) {
      this.setData({
        showBottom: true
      })
      return
    }else{
      var currentPage = parseInt(this.data.currentPage) + 1;
      this.setData({
        currentPage: currentPage
      })
      var data = {
        page: this.data.currentPage,
        user_id: app.globalData.user_id
      }
      wx.showLoading({
        title: '正在加载',
      })
      app.callback_Request('/card_list', 'get', data, _this.callback_getList)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})