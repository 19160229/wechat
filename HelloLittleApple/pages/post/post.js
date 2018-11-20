// pages/post/post.js

import {DBPost} from '../../db/DBPost.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dbPost = new DBPost();
    this.setData({
      postList:dbPost.getAllPostData()
    });
  },

  onShow:function(options){
    var dbPost = new DBPost();
    this.setData({
      postList: dbPost.getAllPostData()
    });
  },

  onTapToDetail(event){
    var postId=event.currentTarget.dataset.postId;
    console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  }

})