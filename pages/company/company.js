var app = getApp();
var util = require('../../utils/util.js');
Component({
  properties: {
    list: {
      type: Array
    }
  },
  data: {
    detail: {},//企业详情
  },
  methods: {
    goDetail: function (e) {
      var _this = this;
      this.setData({
        detail: e.currentTarget.dataset.name,
      })
      app.globalData.companyList.company = _this.data.detail
      var data = { user_id: app.globalData.user_id };
      app.callback_Request('/search_data_save', 'get', data, callback_search);
      wx.navigateTo({
        url: '/company/detail/detail',
      })
      function callback_search(){}
    }
  }
})