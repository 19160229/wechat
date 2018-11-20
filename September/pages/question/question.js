Page({
  data:{
    
  },

  bindCommentInput: function (event) {
    var val = event.detail.value;
    this.data.keyboardInputValue = val;
  },

  submit:function(event){
    var utils=require('../../utils/util.js');
    utils.refreshQA(this.data.keyboardInputValue);
    wx.navigateTo({
      url: '../answer/answer'
    })
  }

})