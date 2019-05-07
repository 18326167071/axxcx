// setting/star/star.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,//当前激活选项卡
    currentPage: 1,//当前激活页
    list: [],//企业列表&&公告列表
    rightIndex: 0,//记录第几个列表被左移了
    startX: '',//起始点startX
    sumPage: 0,//总页数
    showLoading: false,//是否显示正在加载
  },
  //选择选项卡
  chooseTab: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.tab,
      currentPage: 1,
      list:[],
    })
    this.getList();
    var obj = '';
    if (app.globalData.user_id) {
      obj += 'user_id:' + app.globalData.user_id;
    }
    if (obj.length != 0) obj += ',';
    if (e.currentTarget.dataset.tab == 1) {
      obj += 'myTab:company';
    } else if (e.currentTarget.dataset.tab == 2) {
      obj += 'myTab:person';
    }
    obj = '{' + obj + '}';
    app.callback_log((app.globalData.phone || 0), 'setting/star/star', 'tap', obj);
  },
  //开始移动
  moveStart: function(e){
    this.setData({
      startX: e.touches[0].clientX,
      rightIndex: e.currentTarget.dataset.index
    });
  },
  //正在移动
  moveMove: function(e){
    var _this = this;
    if (e.touches[0].clientX - this.data.startX > 100){
      var arr = this.data.list;
      arr.forEach(function(val,index){
        index == _this.data.rightIndex ? val.show = false : val;
      })
      this.setData({
        list: arr
      })
    } else if (e.touches[0].clientX - this.data.startX < -100){
      var arr = this.data.list;
      arr.forEach(function (val, index) {
        index == _this.data.rightIndex ? val.show = true : val.show = false;
      })
      this.setData({
        list: arr
      })
    }
  },
  //获取收藏列表信息
  getList: function(){
    var _this = this;
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      showLoading: false
    })
    var str = '';
    this.data.currentTab == 1 ? str = '/enterprise_collection_list' : this.data.currentTab == 2 ? str = '/person_collection_list' : str;
    var data = {
      'user_id': app.globalData.user_id,
      'page_size': 10,
      'page': this.data.currentPage
    }
    app.callback_Request(str, 'get', data, _this.callback_getList);
  },
  //获取企业收藏列表
  callback_getList: function(res){
    res.data.data.list.forEach(function(val,index){
      val.show = false;
      if (val.enterprise){
        val.enterprise.modifiedTime = val.enterprise.modifiedTime.substr(0,10);
        if (val.exposure){
          val.exposure.modifiedTime = val.exposure.modifiedTime.substr(0, 10);
        }
      }
    })
    var list = this.data.list;
    list = list.concat(res.data.data.list);
    wx.hideLoading();
    this.setData({
      list: list,
      sumPage: res.data.data.totalPage,
      showLoading: true
    })
  },
  //取消收藏
  calcel: function(e){
    var _this = this;
    var path = '', data = {};
    if (e.currentTarget.dataset.type==1){
      path = '/enterprise_collection_delete';
      data = {
        'user_id': app.globalData.user_id,
        'enterprise_id': e.currentTarget.dataset.id
      }
    } else if (e.currentTarget.dataset.type == 2) {
      path = '/person_collection_delete';
      data = {
        'user_id': app.globalData.user_id,
        'person_id': e.currentTarget.dataset.id
      }
    }
    app.callback_Request(path, 'get', data, _this.callback_cancel);
  },
  //取消收藏的回调
  callback_cancel: function(res){
    if(res.data.code == 200){
      wx.showToast({
        title: '取消收藏成功',
      });
      this.setData({
        list: [],
        currentPage: 1
      })
      this.getList();
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'collocation:false';
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'setting/star/star', 'tap', obj);
    }else{
      wx.showToast({
        title: '取消收藏失败',
        icon: 'none'
      })
    }
  },
  //去详情
  goDetail: function (e) {
    if(this.data.currentTab == 1){
      app.globalData.companyList.company = e.currentTarget.dataset.item.name
      wx.navigateTo({
        url: '/company/detail/detail',
      })
    }else{
      app.globalData.person = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/personnel/detail/detail',
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
    this.setData({
      list:[]
    })
    this.getList();
    var pages = getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2].route;//上一页面指针 
    var obj = '';
    if (app.globalData.user_id) {
      obj += 'user_id:' + app.globalData.user_id;
    }
    if (obj.length != 0) obj += ',';
    obj += 'prev:' + prepage;
    obj = '{' + obj + '}';
    app.callback_log((app.globalData.phone || 0), 'setting/star/star', 'show', obj);
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
    if(this.data.currentPage >= this.data.sumPage) return;
    this.setData({
      currentPage: parseInt(this.data.currentPage) + 1
    })
    this.getList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})