// setting/description/description.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    content:'',//公司简介
    list:[]//介绍明细
  },
  //获取公司简介回调
  callback_introduce: function(res){
    var arr = res.data.data.list.content.split('///')
    if(arr[0].indexOf('***')!=-1){
      var str = arr[0].slice(3,-3);
      arr = arr.splice(1)
      this.setData({
        content: str
      })
    }
    var obj = {};
    var arr1 = [];
    arr.forEach(function(val,index){
      if(val.indexOf('***')==-1){
        obj.title = val;
      }else{
        obj.content = val.slice(3,-3);
        arr1.push(obj);
        obj = {};
      }
    })
    this.setData({
      list: arr1
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
    var data = {};
    app.callback_Request('/get_company_introduce', 'get', data, _this.callback_introduce);
    var pages = getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2].route;//上一页面指针 
    var obj = '';
    if (app.globalData.user_id) {
      obj += 'user_id:' + app.globalData.user_id;
    }
    if (obj.length != 0) obj += ',';
    obj += 'prev:' + prepage;
    obj = '{' + obj + '}';
    app.callback_log((app.globalData.phone || 0), 'setting/description/description', 'show', obj);
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