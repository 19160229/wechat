// pages/post/post-comment/post-comment.js

import {DBPost} from '../../../db/DBPost.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    useKeyboardFlag:true,
    keyboardInputValue:'',
    sendMoreMsgFlag:false,
    chooseFiles:[],
    deleteIndex:-1,
    currentAudio:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId=options.id;
    this.dbPost=new DBPost(postId);
    var comments=this.dbPost.getCommentData();

    this.setData({
      comments:comments
    });
  },

  previewImg:function(event){
    var commentIdx=event.currentTarget.dataset.commentIdx;
    console.log(commentIdx);
    var imgIdx=event.currentTarget.dataset.imgIdx;
    var imgs=this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current:imgs[imgIdx],
      urls: imgs
    })
  },

  switchInputType:function(event){
    this.setData({
      useKeyboardFlag:!this.data.useKeyboardFlag
    })
  },

  bindCommentInput:function(event){
    var val=event.detail.value;
    this.data.keyboardInputValue=val;
  },

  submitComment:function(event){
    var imgs=this.data.chooseFiles;
    var newData={
      username:"青石",
      avatar:"/images/avatar/avatar-3.png",
      create_time:new Date().getTime()/1000,
      content:{
        txt:this.data.keyboardInputValue,
        img:imgs
      },
    };
    if(!newData.content.txt&&imgs.length===0){
      return;
    }
    this.dbPost.newComment(newData);
    this.showCommitSuccessToast();
    this.bindCommentData();
    this.resetAllDefaultStatus();
  },

  submitVoiceComment:function(audio){
    var newData = {
      username: "青石",
      avatar: "/images/avatar/avatar-3.png",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: '',
        img: [],
        audio:audio
      },
    };
    this.dbPost.newComment(newData);
    this.showCommitSuccessToast();
    this.bindCommentData();
  },

  showCommitSuccessToast:function(){
    wx.showToast({
      title: '评论成功',
      duration:1000,
      icon:'success'
    })
  },

  bindCommentData:function(){
    var comments=this.dbPost.getCommentData();
    this.setData({
      comments:comments
    });
  },

  resetAllDefaultStatus:function(){
    this.setData({
      keyboardInputValue:"",
      chooseFiles:[],
      sendMoreMsgFlag:false
    });
  },

  sendMoreMsg:function(){
    this.setData({
      sendMoreMsgFlag:!this.data.sendMoreMsgFlag
    })
  },

  chooseImage:function(event){
    var imgArr=this.data.chooseFiles;
    var leftCount=3-imgArr.length;
    if(leftCount<=0){
      return;
    }
    var sourceType=[event.currentTarget.dataset.category],
      that=this;
    wx.chooseImage({
      count:leftCount,
      sourceType:sourceType,
      success: function(res) {
        that.setData({
          chooseFiles:imgArr.concat(res.tempFilePaths)
        });
      }
    })
  },

  deleteImage:function(event){
    var index=event.currentTarget.dataset.idx,
      that=this;
    that.data.chooseFiles.splice(index,1);
    setTimeout(function(){
      that.setData({
        chooseFiles: that.data.chooseFiles
      });
    },500)
  },

  recordStart:function(){
    var that=this;
    this.setData({
      recodingClass:'recoding'
    });
    this.startTime=new Date();
    wx.startRecord({
      success:function(res){
        var diff=(that.endTime-that.startTime)/1000;
        diff=Math.ceil(diff);

        that.submitVoiceComment({url:res.tempFilePath,timeLen:diff});
      },
      fail:function(res){
        console.log(res);
      },
      complete:function(res){
        console.log(res);
      }
    })
  },

  recordEnd:function(){
    this.setData({
      recodingClass:''
    });
    this.endTime=new Date();
    wx.stopRecord();
  },

  playAudio:function(event){
    var url=event.currentTarget.dataset.url;
    var that=this;

    if(url==this.data.currentAudio){
      wx.pauseVoice();
      this.data.currentAudio="";
    }
    else{
      this.data.currentAudio=url;
      wx.playVoice({
        filePath: 'url',
        complete: function(res) {
          that.data.currentAudio="";
        },
      });
    }
  }
})