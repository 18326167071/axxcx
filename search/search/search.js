// company/search/search.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',//搜索项企业名

    area: [],//地区选择列表
    areaParent: [],//地区选择省份
    areaIndex: [0],//地区选择索引
    province: '',//搜索项地区id

    peopleList: [],//可选资质列表
    peopleDetailList: [],//可选资质详细列表
    peopleIndexList: [],//可选资质索引列表
    peopleId: 0,//搜索项资质id
    peopleChooseList: [],//已添加条件列表
    showPeopleChoose: false,//已选择资质弹窗是否显示

    aptitudeList: [],//可选资质列表
    aptitudeDetailList: [],//可选资质详细列表
    aptitudeIndexList: [],//可选资质索引列表
    aptitudeId: 0,//搜索项资质id
    aptitudeChooseList: [],//已添加条件列表
    showChoose: false,//已选择资质弹窗是否显示

    endDate: '',//结束时间
    startTime: '',//项目开始时间
    endTime: '',//项目结束时间

    money: [['不限', '200万以下', '200万~1000万', '1000万~3000万', '3000万~5000万', '5000万~1亿', '1亿以上']],//项目金额
    moneyIndex: [0],//项目金额索引
    moneyId: '',//选择的项目金额

    loginPop: false,//授权弹窗是否弹出
    isVip: false,//是否领取会员卡
    phone: '',//存手机号
    isDoneVip: false,//会员卡是否已过期
  },
  //确定搜索企业名
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //选择省份
  inputArea: function (e) {
    var _this = this;
    this.setData({
      areaIndex: [e.detail.value],
      province: _this.data.areaParent[e.detail.value].name
    })
  },
  //获取省份回调
  callback_areaParent: function (res) {
    var _this = this;
    if (JSON.stringify(res.data) == "{}") {
      res.data = []; 
    }
    var all = {
      id: 0,
      name: '全国'
    }
    res.data.unshift(all)
    this.setData({
      areaParent: res.data,
      province: res.data[this.data.areaIndex].name
    })
    var arrParent = [];
    _this.data.areaParent.forEach(function (val) {
      arrParent.push(val.name)
    })
    this.setData({
      area: [arrParent]
    })
  },
  //获取资质列表
  callback_people: function (res) {
    var _this = this;
    if (this.data.peopleList.length == 0) {
      var all = {
        name: '不限',
        id: '0'
      };
      res.data.unshift(all);
      var arr = [];
      res.data.forEach(function (val) {
        arr.push(val.name)
      })
      this.setData({
        peopleList: [[arr]],
        peopleDetailList: [[res.data]],
        peopleIndexList: [[0]]
      })
    } else {
      var ind = 0;
      this.data.peopleDetailList.forEach(function (val, index) {
        val[0].forEach(function (val1, index1) {
          if (val1.id == _this.data.peopleId) {
            ind = index;
            var name = _this.data.peopleIndexList;
            name[ind] = [index1];
            _this.setData({
              peopleIndexList: name
            })
          }
        })
      })
      if (res.data.length == 0) {
        return;
      }
      if (JSON.stringify(res.data) == "{}") {
        res.data = [];
      }
      var all = {
        name: '不限',
        id: ind + 1
      };
      res.data.unshift(all);
      var arr = [];
      res.data.forEach(function (val) {
        arr.push(val.name)
      })
      var arr1 = _this.data.peopleList;
      arr1[ind + 1] = [arr];
      if (arr1.length > ind + 2) {
        arr1.splice(ind + 2)
      }
      arr1.forEach(function (val, index) {
        if (val[0].length == 1) {
          arr1.splice(index, 1)
        }
      })
      var arr2 = _this.data.peopleDetailList;
      arr2[ind + 1] = [res.data];
      if (arr2.length > ind + 2) {
        arr2.splice(ind + 2)
      }
      arr2.forEach(function (val, index) {
        if (val[0].length == 1) {
          arr2.splice(index, 1)
        }
      })
      var arr3 = _this.data.peopleIndexList;
      arr3[ind + 1] = [0];
      this.setData({
        peopleList: arr1,
        peopleDetailList: arr2,
        peopleIndexList: arr3
      })
    }
  },
  //添加条件
  peopleAdd: function () {
    var _this = this;
    if (this.data.peopleIndexList[0] == 0) {
      wx.showToast({
        title: '请先选择专业条件',
        icon: 'none'
      })
      return;
    } else if (this.data.peopleChooseList.length >= 4) {
      wx.showToast({
        title: '条件选择已达上限',
        icon: 'none'
      })
      return;
    }
    var arr = [];
    this.data.peopleDetailList.forEach(function (val, index) {
      if (val[0][_this.data.peopleIndexList[index][0]].name != '不限') {
        arr.push(val[0][_this.data.peopleIndexList[index][0]].name)
      }
    })
    var arr1 = this.data.peopleChooseList;
    var bool = true;
    arr1.forEach(function (val, index) {
      if (val.join(',') == arr.join(',')) {
        wx.showToast({
          title: '已选择此专业条件，请重新选择',
          icon: 'none'
        })
        bool = false;
      }
    })
    if (!bool) {
      return;
    }
    arr1.push(arr);
    this.setData({
      peopleChooseList: arr1,
      peopleId: 0,
    })
    var data = {
      parentID: this.data.peopleId,
      user_id: app.globalData.user_id 
    };
    app.callback_Request('/Certificate/GetCertificate', 'get', data, _this.callback_people);
  },
  //选取资质
  inputpeople: function (e) {
    var _this = this;
    this.setData({
      peopleId: e.currentTarget.dataset.data[0][e.detail.value].id
    })
    var data = {
      parentID: this.data.peopleId,
      user_id: app.globalData.user_id 
    };
    app.callback_Request('/Certificate/GetCertificate', 'get', data, _this.callback_people);
  },
  //显示已选条件弹窗
  showPeopleChooseBox: function () {
    this.setData({
      showPeopleChoose: true
    })
  },
  //隐藏已选条件弹窗
  closePeopleChooseBox: function () {
    this.setData({
      showPeopleChoose: false
    })
  },
  //删除选项
  deletePeopleChoose: function (e) {
    var ind = e.currentTarget.dataset.delete;
    var arr = this.data.peopleChooseList;
    arr.splice(ind, 1);
    this.setData({
      peopleChooseList: arr
    })
    if (arr.length == 0) {
      this.setData({
        showPeopleChoose: false
      })
    }
  },
  //设置开始时间
  inputStartTime: function (e) {
    this.setData({
      startTime: e.detail.value
    })
    if (!this.data.endTime) {
      this.setData({
        endTime: e.detail.value
      })
    }
  },
  //设置结束时间
  inputEndTime: function (e) {
    this.setData({
      endTime: e.detail.value
    })
    if (!this.data.startTime) {
      this.setData({
        startTime: e.detail.value
      })
    }
  },
  //选择项目金额
  inputMoney: function (e) {
    this.setData({
      moneyIndex: [e.detail.value],
      moneyId: this.data.money[0][e.detail.value]
    })
  },
  //去搜索
  goSearch: function () {
    var _this = this;
    if (!app.globalData.phone) {
      this.setData({
        loginPop: true
      })
      return;
    }
    var obj = {};
    obj.province = this.data.province;
    var arr = [];
    this.data.peopleDetailList.forEach(function (val, index) {
      if (val[0][_this.data.peopleIndexList[index][0]].name != '不限') {
        arr.push(val[0][_this.data.peopleIndexList[index][0]].name)
      }
    })
    var arr1 = this.data.peopleChooseList;
    var bool = true;
    arr1.forEach(function (val, index) {
      if (val.join(',') == arr.join(',')) {
        bool = false;
      }
    })
    var array = [];
    if (bool) {
      arr.length != 0 ? array = [arr] : array;
    }
    arr1.forEach(function (val, index) {
      array.push(val)
    })
    obj.peopleChooseList = array;
    arr = [];
    this.data.aptitudeDetailList.forEach(function (val, index) {
      if (val[0][_this.data.aptitudeIndexList[index][0]].name != '不限') {
        arr.push(val[0][_this.data.aptitudeIndexList[index][0]].name)
      }
    })
    arr1 = this.data.aptitudeChooseList;
    bool = true;
    arr1.forEach(function (val, index) {
      if (val.join(',') == arr.join(',')) {
        bool = false;
      }
    })
    array = [];
    if (bool) {
      arr.length != 0 ? array = [arr] : array;
    }
    arr1.forEach(function (val, index) {
      array.push(val)
    })
    obj.aptitudeChooseList = array;
    obj.startTime = this.data.startTime;
    obj.endTime = this.data.endTime;
    obj.moneyIndex = this.data.moneyIndex[0];
    if (obj.province == '全国' && obj.peopleChooseList.length == 0 && obj.aptitudeChooseList.length == 0 && !obj.startTime && !obj.endTime && !obj.moneyIndex) {
      wx.showToast({
        title: '请先选择查询条件',
        icon: 'none'
      })
      return;
    }
    obj.all = true;
    app.globalData.companyList = obj;
    wx.navigateTo({
      url: '/company/list/list',
    })
    if (app.globalData.companyList.province) {
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'province:' + app.globalData.companyList.province;
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'search/search/search', 'show', obj);
    }
    if (app.globalData.companyList.aptitudeChooseList.length != 0) {
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'aptitude:' + app.globalData.companyList.aptitudeChooseList;
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'search/search/search', 'show', obj);
    }
    if (app.globalData.companyList.peopleChooseList.length != 0) {
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'people:' + app.globalData.companyList.peopleChooseList;
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'search/search/search', 'show', obj);
    }
    if (app.globalData.companyList.startTime) {
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'time:' + app.globalData.companyList.startTime + '-' + app.globalData.companyList.endTime;
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'search/search/search', 'show', obj);
    }
    if (app.globalData.companyList.moneyIndex) {
      var obj = '';
      if (app.globalData.user_id) {
        obj += 'user_id:' + app.globalData.user_id;
      }
      if (obj.length != 0) obj += ',';
      obj += 'money:' + this.data.moneyId;
      obj = '{' + obj + '}';
      app.callback_log((app.globalData.phone || 0), 'search/search/search', 'show', obj);
    }
  },
  //获取资质列表
  callback_aptitude: function (res) {
    var _this = this;
    if (this.data.aptitudeList.length == 0) {
      var all = {
        name: '不限',
        id: '0'
      };
      res.data.unshift(all);
      var arr = [];
      res.data.forEach(function (val) {
        arr.push(val.name)
      })
      this.setData({
        aptitudeList: [[arr]],
        aptitudeDetailList: [[res.data]],
        aptitudeIndexList: [[0]]
      })
    } else {
      var ind = 0;
      this.data.aptitudeDetailList.forEach(function (val, index) {
        val[0].forEach(function (val1, index1) {
          if (val1.id == _this.data.aptitudeId) {
            ind = index;
            var name = _this.data.aptitudeIndexList;
            name[ind] = [index1];
            _this.setData({
              aptitudeIndexList: name
            })
          }
        })
      })
      if (res.data.length == 0) {
        return;
      }
      if (JSON.stringify(res.data) == "{}") {
        res.data = [];
      }
      var all = {
        name: '不限',
        id: ind + 1
      };
      res.data.unshift(all);
      var arr = [];
      res.data.forEach(function (val) {
        arr.push(val.name)
      })
      var arr1 = _this.data.aptitudeList;
      arr1[ind + 1] = [arr];
      if (arr1.length > ind + 2) {
        arr1.splice(ind + 2)
      }
      arr1.forEach(function (val, index) {
        if (val[0].length == 1) {
          arr1.splice(index, 1)
        }
      })
      var arr2 = _this.data.aptitudeDetailList;
      arr2[ind + 1] = [res.data];
      if (arr2.length > ind + 2) {
        arr2.splice(ind + 2)
      }
      arr2.forEach(function (val, index) {
        if (val[0].length == 1) {
          arr2.splice(index, 1)
        }
      })
      var arr3 = _this.data.aptitudeIndexList;
      arr3[ind + 1] = [0];
      this.setData({
        aptitudeList: arr1,
        aptitudeDetailList: arr2,
        aptitudeIndexList: arr3
      })
    }
  },
  //添加条件
  aptitudeAdd: function () {
    var _this = this;
    if (this.data.aptitudeIndexList[0] == 0) {
      wx.showToast({
        title: '请先选择资质条件',
        icon: 'none'
      })
      return;
    } else if (this.data.aptitudeChooseList.length >= 4) {
      wx.showToast({
        title: '条件选择已达上限',
        icon: 'none'
      })
      return;
    }
    var arr = [];
    this.data.aptitudeDetailList.forEach(function (val, index) {
      if (val[0][_this.data.aptitudeIndexList[index][0]].name != '不限') {
        arr.push(val[0][_this.data.aptitudeIndexList[index][0]].name)
      }
    })
    var arr1 = this.data.aptitudeChooseList;
    var bool = true;
    arr1.forEach(function (val, index) {
      if (val.join(',') == arr.join(',')) {
        wx.showToast({
          title: '已选择此资质条件，请重新选择',
          icon: 'none'
        })
        bool = false;
      }
    })
    if (!bool) {
      return;
    }
    arr1.push(arr);
    this.setData({
      aptitudeChooseList: arr1,
      aptitudeId: 0,
    })
    var data = {
      parentID: this.data.aptitudeId,
      user_id: app.globalData.user_id 
    };
    app.callback_Request('/Qualification/GetQualification', 'get', data, _this.callback_aptitude);
  },
  //选取资质
  inputAptitude: function (e) {
    var _this = this;
    this.setData({
      aptitudeId: e.currentTarget.dataset.data[0][e.detail.value].id
    })
    var data = {
      parentID: this.data.aptitudeId,
      user_id: app.globalData.user_id 
    };
    app.callback_Request('/Qualification/GetQualification', 'get', data, _this.callback_aptitude);
  },
  //显示已选条件弹窗
  showChooseBox: function () {
    this.setData({
      showChoose: true
    })
  },
  //隐藏已选条件弹窗
  closeChooseBox: function () {
    this.setData({
      showChoose: false
    })
  },
  //删除选项
  deleteChoose: function (e) {
    var ind = e.currentTarget.dataset.delete;
    var arr = this.data.aptitudeChooseList;
    arr.splice(ind, 1);
    this.setData({
      aptitudeChooseList: arr
    })
    if (arr.length == 0) {
      this.setData({
        showChoose: false
      })
    }
  },
  //清空时间
  cancelTime: function () {
    this.setData({
      startTime: '',
      endTime: ''
    })
  },
  //首次登陆获取微信授权
  getPhoneNumber(e) {
    var _this = this;
    if (e.detail.encryptedData) {
      this.setData({
        loginPop: false
      })
      var data = {
        'sessionKey': app.globalData.session_key,
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv
      }
      app.callback_Request('/user/decrypt', 'get', data, _this.callback_info);
    } else {
      this.setData({
        loginPop: false
      })
      wx.navigateTo({
        url: '/login/login/login',
      })
    }
  },
  //首次登录获取微信授权设置unionId
  callback_info(res) {
    var _this = this;
    this.setData({
      phone: res.data.data.content.phoneNumber
    })
    if (res.data.code == 200) {
      app.globalData.phone = res.data.data.content.phoneNumber;
      var data = {
        user_id: '',
        union_id: '',
        open_id: '',
        mobile: res.data.data.content.phoneNumber
      };
      app.callback_Request('/user/user_info', 'get', data, _this.callback_checkPhone)
    }
  },
  //通过手机号判断是否是我们用户
  callback_checkPhone: function (res) {
    var _this = this;
    if (res.data.code == 500 && res.data.data.message == "此用户不存在") {
      var data = {
        user_id: app.globalData.user_id,
        column: 'mobile',
        value: this.data.phone
      };
      app.callback_Request('/user/user_edit', 'get', data, _this.callback_bindPhone)
    } else {
      wx.showToast({
        title: '该手机号已注册账号，请更换手机号',
        icon: 'none'
      })
    }
  },
  //绑定手机号的回调
  callback_bindPhone: function (res) {
    var _this = this;
    if (res.data.code == 200) {
      this.setData({
        loginPop: false
      })
      wx.showToast({
        title: '绑定成功'
      })
    } else {
      wx.showToast({
        title: '绑定失败，请稍后重试',
        icon: 'none'
      })
    }
  },
  //去绑定手机号
  goBind: function () {
    this.setData({
      loginPop: false
    })
    wx.navigateTo({
      url: '/login/login/login',
    })
  },
  //获取当前登录人信息
  callback_getUserInfo(res) {
    var _this = this;
    if (res.data.code == 500 && res.data.data.message == "此用户不存在") {
      var data = {
        union_id: app.globalData.union_id || '',
        open_id: app.globalData.open_id || '',
        source: 1
      }
      data.union_id ? data.union_id : delete data.union_id;
      app.callback_Request('/user/save', 'get', data, _this.callback_Register)
    } else if (res.data.code == 200) {
      app.globalData.user_id = res.data.data.content.id;
      app.globalData.phone = res.data.data.content.mobile;
      app.globalData.userInfo = res.data.data.content;
      if (!res.data.data.content.mobile) {
        this.setData({
          loginPop: true
        })
      } else {
        this.setData({
          loginPop: false
        })
      }
      if (res.data.data.content.not_alert_cards.length != 0) {
        this.setData({
          isVip: true
        })
        var data = {
          user_id: app.globalData.user_id,
          card_type: res.data.data.content.not_alert_cards[0].card_type,
          activity_type: res.data.data.content.not_alert_cards[0].activity_type
        }
        app.callback_Request('/card_edit', 'get', data, _this.callback_userCard)
      }
      wx.getStorage({
        key: 'done',
        fail: function (err) {
          if (!app.globalData.userInfo.is_vip && app.globalData.userInfo.end_time) {
            _this.setData({
              isDoneVip: true
            })
            wx.setStorage({
              key: 'done',
              data: '1',
            })
          }
        }
      })
    }
  },
  //标记已使用会员卡
  callback_userCard: function (res) { },
  //注册用户回调函数
  callback_Register: function (res) {
    var _this = this;
    if (res.data.code == 200) {
      var data = {
        user_id: '',
        union_id: app.globalData.union_id || '',
        open_id: app.globalData.open_id,
        mobile: ''
      };
      app.callback_Request('/user/user_info', 'get', data, _this.callback_getUserInfo)
    }
  },
  //去我的礼卷
  goCard: function () {
    var str = '{"user_id":"' + app.globalData.user_id + '",next":"/setting/card/card"}';
    app.callback_log((app.globalData.phone || 0), 'search/search/search', 'tap', str);
    this.setData({
      isVip: false
    })
    wx.navigateTo({
      url: '/setting/card/card',
    })
  },
  //关闭vip弹窗
  closeVip: function () {
    var str = '{"user_id":"' + app.globalData.user_id + '"}';
    app.callback_log((app.globalData.phone || 0), 'search/search/search', 'tap', str);
    this.setData({
      isVip: false
    })
  },
  //关闭Vip已使用弹窗
  closeDoneVip: function () {
    this.setData({
      isDoneVip: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    this.setData({
      startTime: '',
      endTime: ''
    })
    var num = this.data.peopleId;
    var data = {};
    if (num != 0) {
      data = { parentID: num }
    } else {
      this.setData({
        peopleList: []
      })
    }
    data.user_id = app.globalData.user_id;
    app.callback_Request('/Certificate/GetCertificate', 'get', data, _this.callback_people);
    var num1 = this.data.aptitudeId;
    data = {};
    if (num1 != 0) {
      data = { parentID: num1 }
    } else {
      this.setData({
        aptitudeList: []
      })
    }
    data.user_id = app.globalData.user_id;
    app.callback_Request('/Qualification/GetQualification', 'get', data, _this.callback_aptitude);
    data = {};
    data.user_id = app.globalData.user_id;
    app.callback_Request('/Area/GetAreaList', 'get', data, _this.callback_areaParent);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
})