// pages/black/black.js
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
    detail: {},//黑名单详情
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail: function (e) {
      var _this = this;
        this.setData({
          detail: e.currentTarget.dataset.item
        })
        var data = { user_id: app.globalData.user_id };
        data.code = app.globalData.code;
        data.authentication = app.globalData.authentication;
        app.globalData.black = _this.data.detail
        wx.navigateTo({
          url: '/exposure/detail/detail',
        })
        var obj = '';
        if (app.globalData.user_id) {
          obj += 'user_id:' + app.globalData.user_id;
        }
        if (obj.length != 0) obj += ',';
        obj += 'next:exposure/detail/detail'
        obj = '{' + obj + '}';
        app.callback_log((app.globalData.phone || 0), 'pages/black/black', 'tap', obj);
        var data = { user_id: app.globalData.user_id };
        app.callback_Request('/search_data_save', 'get', data, callback_search);
        function callback_search() { }
    }
  }
})
