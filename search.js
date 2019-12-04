var util = require('utils/util.js')
Page({
  data: {
    searchKeyword: '',  //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },
  onLoad: function (options) {
    this.setData({
      "searchKeyword": options.searchKeyword
    });
    let that = this;
    let searchKeyword = that.data.searchKeyword;
    if (searchKeyword!='')
    this.fetchSearchList();
  },
  //输入框事件，每输入一个字符，就会触发一次  
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //搜索，访问网络  
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数  
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount; //返回数据的个数  
    if (searchKeyword=='')
    {
      wx.showToast({
        title: '内容不能为空！',
      })
      }
    else{
      searchLoading: true;

      //访问网络  
      util.getSearchMusic(searchKeyword, searchPageNum, callbackcount, function (data) {
        console.log(data)
        //判断是否有数据，有则取数据  
        if (Math.ceil(data.total / callbackcount) >= searchPageNum || data.total < callbackcount) {
          let searchList = [];

          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromSearch ? searchList = data.rows : searchList = that.data.searchSongList.concat(data.rows)
          if (data.total < callbackcount || Math.ceil(data.total / callbackcount) == searchPageNum) {
            that.setData({
              searchSongList: searchList, //获取数据数组
              searchLoadingComplete: true,
              searchLoading: false
            })
          }
          else {
            that.setData({
              searchSongList: searchList, //获取数据数组
              searchLoading: true //把"上拉加载"的变量设为false，显示
            });
          }
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
        }
        else {
          wx.showToast({
            title: '没有更多数据',
          })
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        }
      })
    }
  },
  //点击搜索按钮，触发事件  
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1  
      searchSongList: [],  //放置返回数据的数组,设为空  
      isFromSearch: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false //把“没有数据”设为false，隐藏  
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  }
})