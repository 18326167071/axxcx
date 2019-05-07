Component({
  properties: {},
  data: {},
  methods: {
    callPhone:function(e){
      wx.makePhoneCall({
        'phoneNumber': e.currentTarget.dataset.phone
      })
    }
  },
  ready: function () {}
})