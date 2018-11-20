var app=getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function refreshQA(question){
  app.globalData.question = question;
  wx.request({
    url: 'http://172.22.122.72:8080/getAnswerAction!getAnswer.action',
    data:{
      question:question
    },
    success(res){
      console.log(res.data);
      var answer=res.data;
      var jsons = [];
      for (var i = 0; i < answer.length; i++) {
        var item = answer[i];
        var json = [];
        for (var key in item) {
          var param = {
            key: key,
            value: item[key]
          };
          json.push(param);
        }
        jsons.push(json);
      }
      console.log(jsons);
      app.globalData.answer = jsons;  
    }
  })
}

module.exports = {
  formatTime: formatTime,
  refreshQA:refreshQA
}
