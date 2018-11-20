Page({
  onUnload: function (event) {
    console.log("page is unload")
  },
  onTapJump: function (event){
    wx.navigateTo({
      url: '../post/post',
      success:function(){
        console.log("Jump success")
      },
      fail:function(){
        console.log("Jump failed")
      },
      complete:function(){
        console.log("Jump complete")
      }
    })
  },
  onHide:function(event){
    console.log("page is hide")
  }
})