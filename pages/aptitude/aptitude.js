// pages/aptitude/aptitude.js
var app = getApp();
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
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    //去证书详情页面
    goCertificate: function(e){
      wx.navigateTo({
        url: '/company/certificate/certificate?index=' + e.currentTarget.dataset.index,
      })
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'next:company/certificate/certificate'
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'pages/aptitude/aptitude', 'tap', obj);
    },
  }
})
