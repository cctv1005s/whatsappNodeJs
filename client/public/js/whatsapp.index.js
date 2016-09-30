$(function(){
  var height = $(document).height();
  $('.app,.main').css('height',height+'px');
  //聊天emoji框
  var chatEmoji = new emojiBox('.emoji-box');
  //emoji气泡
  var bulbEmoji = new emojiBulbBox('.emoji-bulb-box');
  chatEmoji.init();
  chatEmoji.hide();
  //消息列表封装
  var ml = new messageList('.message-list')
  //输入框
  var ci = new chatInput('.base-chatbox-input',{emojiBox:chatEmoji,messageList:ml});
  
  var am = new appModel('.app',{p1:'.pane-one',p2:'.pane-two',p3:'.pane-three'});
  var sb = new searchBox('.searchbox');
  var cl = new chatList('.chat-list');
  var pc = new pageChange('.pagechange');

  var uep = new editPane('#username-ep',{
    emojiBulbBox:bulbEmoji,
    title:'姓名',
    body:'杨立',
    limit:25
  });

  cl.setState(function(state){
      var chat = state.chat;
      chat.push({
        id:0,
        name:'杨立',
        time:'15:51',
        img:'./img/user1.png',
        content:'我在这儿等着你回来',
        active:false
      });
      chat.push({
        id:1,
        name:'杨立',
        time:'15:51',
        img:'./img/user1.png',
        content:'我在这儿等着你回来',
        active:false
      });
      state.appModel = am;
    });
  });

  $('.main').css('opacity','1')
  .addClass('am-animation-scale-down');

