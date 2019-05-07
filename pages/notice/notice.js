// pages/person/person.js
var app = getApp();
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    detail: {},//招标详情
    isPublic: false,//显示关注公众号弹窗
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail: function (e) {
      var _this = this;
        this.setData({
          detail: e.currentTarget.dataset.id,
        })
      app.globalData.noticeId = _this.data.detail;
      
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'next:notice/detail/detail'
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'pages/notice/notice', 'tap', obj);
      var data = { user_id: app.globalData.user_id };
      app.callback_Request('/search_data_save', 'get', data, callback_search);
      function callback_search() { }
      wx.navigateTo({
        url: '/notice/detail/detail',
      })
    }
  }
})
