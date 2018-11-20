class DBPost{
  constructor(postId){
    this.storageKeyName="postList";
    this.postId=postId;
  }
  
  newComment(newComment){
    this.updatePostData('comment',newComment);
  }

  getCommentData(){
    var util=require('../util/util.js');
    var itemData=this.getPostItemById().data;
    itemData.comments.sort(this.compareWithTime);
    //console.log(itemData);
    var len=itemData.comments.length;
    for (var i=0;i<len;i++){
      var comment=itemData.comments[i];
      comment.create_time=util.getDiffTime(comment.create_time,true);
    }
    return itemData.comments;
  }

  compareWithTime(value1,value2){
    var flag=parseFloat(value1.create_time)-parseFloat(value2.create_time);
    if(flag<0){
      return 1;
    }else if(flag>0){
      return -1;
    }else{
      return 0;
    }
  }

  getPostItemById(){
    var postsData=this.getAllPostData();
    var len=postsData.length;
    for(var i=0;i<len;i++){
      if(postsData[i].postId==this.postId){
        return{
          index :i,
          data :postsData[i]
        }
      }
    }
  }

  getAllPostData(){
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').postList;
      this.execSetStorageSync(res);
    }
    return res;
  }

  execSetStorageSync(data){
    wx.setStorageSync(this.storageKeyName, data);
  }

  collect(){
    return this.updatePostData('collect');
  }

  up(){
    var data=this.updatePostData('up');
    return data;
  }

  updatePostData(category,newComment){
    var itemData=this.getPostItemById();
    var postData=itemData.data;
    var allPostData=this.getAllPostData();
    switch(category){
      case 'collect':
        if(!postData.collectionStatus){
          postData.collectionNum++;
          postData.collectionStatus=true;
        }else{
          postData.collectionNum--;
          postData.collectionStatus=false;
        }
        break;
      case 'up':
        if(!postData.upStatus){
          postData.upNum++;
          postData.upStatus=true;
        }else{
          postData.upNum--;
          postData.upStatus=false;
        }
        break;
      case 'comment':
        postData.comments.push(newComment);
        postData.commentNum++;
        break;
      case 'reading':
        postData.readingNum++;
        break;
      default:
        break;
    }
    allPostData[itemData.index]=postData;
    this.execSetStorageSync(allPostData);
    return postData;
  }

  addReadingTimes(){
    this.updatePostData('reading');
  }
};

export{DBPost}