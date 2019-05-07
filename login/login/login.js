var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    numLeft: 0,//进度条移动距左边距离
    iconLeft: 1,//滑块移动距左边距离
    maxNum: 0,//滑块最长长度
    goSuccess: false,//滑动成功
    startLeft: 0,//开始时触摸点距离左滑块距离
    goOn: false,//是否在拖动过程中
    codeText: '获取验证码',//获取验证码文字
    getCode: false,//控制验证码样式
    time: 60,//倒计时
    phone: '',//手机号
    code: '',//验证码
    isMobile: false,//是否可以确定绑定
    itemWidth: 0,//滑块宽度
  },
  //开始滑动滑块
  moveFun: function(e){
    if (this.data.goSuccess){
      return;
    }
    var short = (wx.getSystemInfoSync().windowWidth - this.data.maxNum)/2;
    if(!this.data.startLeft){
      this.setData({
        startLeft: e.changedTouches[0].clientX - short,
        goOn: true
      })
    } 
    var numLeft = e.changedTouches[0].clientX - short > 0 ? e.changedTouches[0].clientX - short - this.data.startLeft : 0;
    numLeft > this.data.maxNum * 2 + short ? numLeft = this.data.maxNum: numLeft;
    var iconLeft = numLeft * 2 - this.data.startLeft > 0 ? numLeft * 2 + 1 : 1;
    iconLeft > this.data.maxNum * 2 - this.data.itemWidth - 1 ? iconLeft = this.data.maxNum * 2 - this.data.itemWidth - 1 : iconLeft;
    iconLeft >= this.data.maxNum * 2 - this.data.itemWidth - 1 ? numLeft = this.data.maxNum : numLeft;
    if (iconLeft >= this.data.maxNum * 2 - this.data.itemWidth - 1){
      this.setData({
        goOn: false
      })
    }else{
      this.setData({
        goOn: true
      })
    }
    this.setData({
      numLeft: numLeft,
      iconLeft: iconLeft/2 - short
    })
  },
  //结束滑动滑块
  endFun: function (e) {
    if (this.data.startLeft && !this.data.goOn){
      this.setData({
        goSuccess: true,
        getCode: true
      })
    }else{
      this.setData({
        goSuccess: false,
        numLeft: 0,
        iconLeft: 1,
        startLeft: 0
      })
    }
    this.setData({
      goOn: false,
    })
  },
  //获取验证码一系列操作
  goCode: function () {
    var _this = this;
    if (this.data.getCode){
      var data = {
        mobile: this.data.phone,
        user_id: app.globalData.user_id,
      }
      app.callback_Request('/send_verify_code','get',data,_this.callback_getCode)
    }else{
      if(this.data.time == 60){
        wx.showToast({
          title: '请先滑动滑块验证',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '请稍后重新获取验证码',
          icon: 'none'
        })
      }
    }
  },
  //获取验证码回调函数
  callback_getCode: function(res){
    var _this = this;
    if(res.data.code==200){
      wx.showToast({
        title: res.data.data.message
      })
      this.setData({
        isMobile: true
      })
    }else if(res.data.code==501){
      wx.showToast({
        title: res.data.data.list.mobile ? res.data.data.list.mobile.join() : res.data.data.list.user_id ? res.data.data.list.user_id.join() : '',
        icon: 'none'
      })
      return;
    } else if (res.data.code == 500) {
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
      return;
    }
    this.setData({
      time: this.data.time - 1
    })
    this.setData({
      codeText: this.data.time + 's',
      getCode: false
    })
    var timer = setInterval(function () {
      if (_this.data.time != 1) {
        _this.setData({
          time: _this.data.time - 1
        })
        _this.setData({
          codeText: _this.data.time + 's'
        })
      } else {
        _this.setData({
          codeText: '再次获取验证码',
          getCode: true,
          time: 60
        })
        clearInterval(timer)
      }
    }, 1000)
  },
  //添加电话号码
  addPhone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //添加验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //确定绑定
  changeInfoMobile: function () {
    var _this = this;
    if(this.data.isMobile){
      var data = {
        mobile: this.data.phone,
        verify_code: this.data.code,
        user_id: app.globalData.user_id
      }
      app.callback_Request('/check_verify_code', 'get', data, _this.callback_changeInfoMobile)
    }else{
      if(!this.data.phone){
        wx.showToast({
          title: '请先输入手机号',
          icon: 'none'
        })
      } else if (!this.data.getCode){
        wx.showToast({
          title: '请先滑动滑块验证',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '请先获取验证码',
          icon: 'none'
        })
      }
      return;
    }
  },
  callback_changeInfoMobile: function(res){
    if(res.data.code==200){
      wx.showToast({
        title: res.data.data.message
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
      },2000)
    }else{
      wx.showToast({
        title: res.data.data.message,
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var query = wx.createSelectorQuery();
    var _this = this;
    query.select('.tap-line').boundingClientRect(function (res) {
      _this.setData({
        maxNum: res.width
      })
    }).exec();
    query.select('.tap-item').boundingClientRect(function (res) {
      _this.setData({
        itemWidth: res.width
      })
    }).exec();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
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