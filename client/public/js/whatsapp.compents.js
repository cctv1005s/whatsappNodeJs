;(function($){
    'use strict'

    //定义ML拓展函数
    var _ml,_ci,_am,_sb,_cl,_pc,_add; 
    _sb = function(Model,fn){
        fn();
    }
    _add = _pc = _cl = _ml = _ci = _am = _sb;

    /*chatBox类*/
    var ML = function(node){
        this.$container = $(node);
        //存储所有消息的列表
        this.messageList = [];
        this.init();
    }

    /*输入框控制*/
    var CI = function(node,option){
        this.$container = $(node);
        option = option||{};
        //获取输入的div
        this.$word_input = $($(node).find('.word-input-div'));
        this.$word_input.html("");
        this.emoji_open = '[data-emoji-open]';
        this.emoji_close = '[data-emoji-close]';
        this.audio_input = '[data-audio-input]';
        this.msg_send = '[data-msg-send]'
        
        //emoji输入框
        this.emojiBox = option.emojiBox;
        //messageList
        this.messageList = option.messageList;

        this.$leftContainer = $(this.emoji_open).parent();
        this.$rightContainer = $(this.audio_input).parent();
        this.init();
    }

    var AM = function(node,option){
        //获取三个页面
        this.$container = $(node),
        this.$p1 = $(option.p1),
        this.$p2 = $(option.p2),
        this.$p3 = $(option.p3);
        this.option = option;
        this.init();
    }

    var SB = function(node,option){
        this.$container = $(node);
        this.init();
    }

    var CL = function(node,option){
        this.$container = $(node);
        this.init();
    }

    var PC = function(node,option){
        this.$container = $(node);
        this.init();
    }
    /*emoji 气泡*/
    var EBB = function(node,option){
        this.$container = $(node);
        this.option = option;
        this.node = node;
        this.init();
    }

    /*editpane*/
    var EP = function(node,option){
        this.$container = $(node);
        this.option = option;
        this.init();
    }

    /*扩展*/
    ML.fn = ML.prototype;
    CI.fn = CI.prototype; 
    AM.fn = AM.prototype;
    SB.fn = SB.prototype;
    CL.fn = CL.prototype;
    PC.fn = PC.prototype;
    EBB.fn = EBB.prototype;
    EP.fn = EP.prototype;

    /*加入全局*/
    window.messageList = ML;
    window.chatInput = CI;
    window.appModel = AM;
    window.searchBox = SB;
    window.chatList = CL;
    window.pageChange = PC;
    window.emojiBulbBox = EBB;
    window.editPane = EP;

_ml(ML,function(){
    ML.fn.init = function(){
        this.state = {};
        this.state.messageList = [];
        this.render();
    }

    ML.fn.addMsg = function(msg){
        this.state.messageList.push(msg);
        this.render();
    }

    ML.fn.setState = function(fn){
        fn(this.state);
        this.render();
    }

    ML.fn.render = function(){
        var ml = this.state.messageList,
            $container = this.$container;
        var html = "";
        for(var i = 0;i < ml.length ;i++){
            html += this.getTextBulb(ml[i]);
        }
        $container.html(html);
    }
});

_ml(ML,function(){
    ML.fn.getTextBulb = function(msg){
        var msgId = msg.id||0,
            msgContinue = msg.continue||true,
            msgIn = msg.in||false,
            msgContentType = msg.contentType||'text',
            msgContent = msg.content||'',
            msgDateTime = msg.dateTime||'';

            var mcontinue =  !msgContinue?'msg-continution':'';
            var min = msgIn?'message-in':'message-out';

var html =  '<div data-msg-id='+msgId+' class="msg '+mcontinue+'">'+
                '<div class="message message-chat '+min+'">'+
                    '<span class="tail-container"></span>'+
                    '<div class="buble buble-text">'+
                      '<span class="message-text">'+
                        msgContent+
                      '</span>'+
                    '</div>'+
                    '<div class="msg-info">'+
                      '<span></span>'+
                      '<span class="msg-time">'+
                        msgDateTime+
                      '</span>'+
                      '<span></span>'+
                    '</div>'+
                '</div>'+
            '</div>'
        return html;
    }
});

/*chat_input*/
_ci(CI,function(){

    CI.fn.init = function(){
        //事件绑定
        this.eventBind();
    };

    CI.fn.eventBind = function(){
        var self = this;
        var $container = this.$container;
        $container.on('click', this.emoji_open, function(event) {
            event.preventDefault();
            /* Act on the event */
            self.emojiOpen();
        });

        $container.on('click',this.emoji_close, function(event) {
            event.preventDefault();
            /* Act on the event */
            self.emojiClose();
        });

        /*发送消息*/
        $container.on('click',this.msg_send,function(event){
            event.stopPropagation();
            console.log($container.find(self.msg_send));
            if($container.find(self.msg_send))
            self.sendText();

        });

        /*键盘敲下，有内容时*/
        this.$word_input.keyup(function(event) {
            if(event.which==13){
                self.sendText();
            }
            if(self.$word_input.html().length !== 0){
                self.$rightContainer.html(CI.btn.sendText);
            }
            else{
                self.$rightContainer.html(CI.btn.audioOpen);
            }
        });

        setInterval(function(){
            if(self.$word_input.html().length !== 0){
                self.$rightContainer.html(CI.btn.sendText);
            }
            else{
                self.$rightContainer.html(CI.btn.audioOpen);
            }
        }, 1000);

        //绑定emoji事件
        this.bindEmoji();
    };
    
    /*让焦点集中在输入框*/
    CI.fn.foucusInput = function(){
        var $word_input = this.$word_input;
        $word_input.focus();
    }

    /*往输入框里面添加内容*/
    CI.fn.addInput = function(html){
        var $word_input = this.$word_input;
        $word_input.append(html)
    }   

    // 拉起emoji表情
    CI.fn.emojiOpen = function(){
        var emojiBox = this.emojiBox;
        emojiBox.show();
        this.foucusInput();
        this.$leftContainer.html(CI.btn.emojiClose);
    }

    CI.fn.emojiClose = function(){
        var emojiBox = this.emojiBox;
        emojiBox.hide();
        this.$leftContainer.html(CI.btn.emojiOpen);   
    }

    /*将emoji输入的内容绑定在输入框内*/
    CI.fn.bindEmoji = function(){
        var emojiBox = this.emojiBox;
        var self = this;
        emojiBox.bindClick(function(html){
            self.$word_input.append(html);
        });
    }

    /*发送消息*/
    CI.fn.sendText = function(){
        var msg = this.$word_input.html();
        if(msg == "")
            return ;
        /*去掉换行符*/
        msg = msg.replace(/<br>/ig,'');
        console.log(msg);
        this.messageList.addMsg({
            id:0,
            continue:false,
            in:false,
            contentType:'text',
            content:msg,
            dateTime:'21:54'
        });
        this.$word_input.html("");
    }

    /*拉起语音输入*/
    CI.fn.audioOpen = function(){

    }

    /*发送语音输入*/
    CI.fn.snedAudio = function(){

    }

    CI.fn.initUI = function(){
       this.$word_input.html("");
       this.emojiClose();
    }

});

_ci(CI,function(){
    CI.btn = {};
    CI.btn.sendText = '<i data-msg-send class="am-icon-paper-plane"></i>';
    CI.btn.emojiClose = '<i data-emoji-close class="am-icon-chevron-down"></i>';
    CI.btn.emojiOpen = '<i data-emoji-open class="am-icon-smile-o"></i>';
    CI.btn.audioOpen = '<i data-audio-input class="am-icon-microphone"></i>';
})

/*appModel*/
_am(AM,function(){
    AM.fn.init = function(){
        this.eventBind();
    }

    AM.fn.eventBind = function(){
        var self = this;
        this.$container.on('click', AM.btn.openModel, function(event) {
            self.openModel();
        });
        this.$container.on('click', AM.btn.closeModel, function(event) {
            self.closeModel();
        });
    }

    AM.fn.openModel = function(){
      this.$p1.css('width','25%');
      this.$p2.css('width','45%');
      this.$p3.css('width','30%');
    }

    AM.fn.closeModel = function(){
      this.$p1.css('width','30%');
      this.$p2.css('width','70%');
      this.$p3.css('width','0%');
    }

    AM.fn.newChatBox = function(id){
        var $p2 = this.$p2;
        var chatInput = this.option.chatInput,
            messageList = this.option.messageList;

        //初始化聊天窗口
        // chatInput.initUI();
        var getChatBoxInfo = function(id){
        };
        var $chatBox = $p2.find('.base-chatbox');
        $chatBox.css('display', 'block');
    }

    AM.btn = {};
    AM.btn.openModel = '[data-model-open]';
    AM.btn.closeModel = '[data-model-close]';
});


/*chat-list*/
_cl(CL,function(){
    /*chat-list绑定一个搜索选项*/
    CL.fn.init = function(){
        this.state = {};
        this.state.chat = [];
        this.eventBind();
    }
    
    /*状态全部交给这一个*/
    CL.fn.setState = function(fn){
        fn(this.state)
        this.render();
    }

    CL.fn.render = function(){
        var chat = this.state.chat;
        var $container = this.$container;
        var html = "";
        for(var i = 0;i < chat.length ;i++){
            html+= CL.UI.chatItem(chat[i]);   
        }
        $container.html(html);
    }

    CL.fn.activeChatItem = function(id){
        var chat = this.state.chat;
        for(var i = 0;i < chat.length;i++){
            chat[i].active = false;
            if(chat[i].id == id)
                chat[i].active = true;
        }
        this.render();
    }

    CL.fn.eventBind = function(){
        var $container = this.$container;
        var self = this;
        $container.on('click', '.chat-item', function(e) {
            e.preventDefault();
            var $elem = $(e.currentTarget);
            var id = $elem.attr('id');
            self.state.appModel.newChatBox(id);
            self.activeChatItem(id);
        });
    }

    CL.UI = {};
    CL.UI.chatItem = function(chat){
    var id = chat.id,
        name  = chat.name,
        time = chat.time,
        img = chat.img,
        content = chat.content,
        active = chat.active;

        var hactive = active?'active':'';
        var html = '<div id="'+id+'" class="chat-item clearfix '+ hactive +'">'+
          '<!--头像-->'+
          '<div class="chat-avatar am-u-md-2">'+
            '<img class="am-circle char-avatar-head" src="'+img+'">'+
          '</div>'+
          '<div class="chat-body am-u-md-10">'+
            '<div class="chat-body-head clearfix">'+
             '<div class="chat-body-num left boldword">'+name+'</div>'+ 
             '<div class="chat-body-time right greyword">'+ time +'</div>'+
            '</div>'+
            '<div class="chat-body-foot clearfix">'+
              '<div class="chat-body-content">'+ 
                '<i class="am-header-icon am-icon-check check-status">'+'</i>'+
                content+
              '</div>'+
              '<div class="chat-body-menu">'+
                '<span>'+'</span>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
        return html;
    }
});


/*search-box*/
_sb(SB,function(){
    SB.fn.init = function(){
        this.eventBind();
    }

    SB.fn.eventBind = function(){
        var self = this;
        var $container = this.$container;
        $container.on('click', SB.btn.focus, function(event) {
            self.focusInput();
        });
     
        $container.on('click', SB.btn.back, function(event) {
            self.backInit();
        });
    }

    SB.fn.focusInput = function(){
        var $container = this.$container;
        $container.addClass('searchbox-focus');
        $container.find(SB.btn.input).focus();
    }

    SB.fn.backInit = function(){
        var $container = this.$container;
        $container.removeClass('searchbox-focus');        
    }

    SB.btn = {};
    SB.btn.focus = '[data-searchbox-focus]';
    SB.btn.input = '[data-searchbox-input]';
    SB.btn.back = '[data-searchbox-back]';
    SB.btn.lable = '[data-searchbox-lable]';
});

/*pageChange*/
_pc(PC,function(){
    PC.fn.init = function(){
        var $container = this.$container;
        this.$p2 = $container.find('[data-page-2]');
        this.$p3 = $container.find('[data-page-3]');
        this.eventBind();
    }

    PC.fn.eventBind = function(){
        var self = this;
        $('body').on('click', PC.btn.page2in, function(event) {
            self.$p2.addClass('show');
            // self.page2in(fn(e));
        });

        $('body').on('click', PC.btn.page2out, function(event) {
            self.$p2.removeClass('show');
        });

        $('body').on('click', PC.btn.page3in, function(event) {
            self.$p3.addClass('show');
            self.page3in(fn(e));
        });

        $('body').on('click', PC.btn.page3out, function(event) {
            self.$p3.removeClass('show');
        });
    };

    PC.fn.page2in = function(fn){
    };

    PC.fn.page3in = function(fn){
    };

    PC.btn = {};
    PC.btn.page2in = '[data-page-2-in]';
    PC.btn.page2out = '[data-page-2-out]';
    PC.btn.page3in = '[data-page-3-in]';
    PC.btn.page3out = '[data-page-3-out]';
});

_add(EBB,function(){
    EBB.fn.init = function(){
        //初始化emojiBox
        this.emojiBox = new emojiBox(this.node);
        this.emojiBox.init();
        this.$parent = this.$container.parent();
        this.hidden();
    };

    EBB.fn.show = function(pos){
        var x = pos.left,
            y = pos.top;

        var $parent = this.$parent;
        $parent.css({
            'left':x,
            'top':y
        });
        $parent.show();
    }
    EBB.fn.hidden = function(){
        var $parent = this.$parent;
        $parent.hide(); 
    }
    EBB.fn.bindClick = function(cb){
        //返回绑定消息
        this.emojiBox.bindClick(cb);
    }
});

_add(EP,function(){

    EP.fn.init = function(){
        this.emojiBulbBox = this.option.emojiBulbBox;
        this.render();
        this.eventBind();
    }

    EP.fn.render = function(){
        var $container = this.$container;
        var option = this.option,
            title = option.title,
            body = option.body,
            num = option.num||0,
            limit = option.limit; 

            var left = limit - num;

        var html =  '<div class="wa-editpane-title">'+title+'</div>'+
            '<div class="wa-editpane-body">'+
              '<div class="editpane-input clearfix">'+
                '<div data-ep-input contentEditable=false class="wa-editpane-input" maxlength="25">'+body+'</div>'+
                '<div class="wa-editpane-menu">'+
                  '<span data-ep-left class="wa-editpane-num left">'+left+'</span>'+
                  '<span data-ep-emoji class="wa-editpane-emoji icon icon-emoji-input left">'+'</span>'+
                  '<span data-ep-check class="wa-editpane-checkmark icon icon-checkmark left"></span>'+
                  '<span data-ep-edit class="wa-editpane-edit icon icon-pencil left">'+'</span>'+
                '</div>'+
              '</div>'+
            '</div>';

        $container.html(html);
    }

    EP.fn.eventBind = function(){
        var self = this;
        var $container = this.$container;
        $container.on('click',EP.btn.emoji, function(e){
            var $elem = $(e.currentTarget);
            var top = $elem.offset().top,
                left = $elem.offset().left;
            self.emojiBulbBox.show({
                top:top,
                left:left
            });
        });

        $container.on('click',EP.btn.edit,function(e){
            $container.addClass('editable');
            $container.find(EP.btn.input).attr('contentEditable','true');
        });
        
        $container.on('input',EP.btn.input,function(e){
            var option = self.option,
                num = option.num,
                body = option.body,
                limit = option.limit;

            self.option.num = $(e.currentTarget).text().length;
            var left = limit - num;
            if(left < 0){
                $(e.currentTarget).html(self.option.body);
                return;
            }

            self.option.body = $(e.currentTarget).html();
            $container.find(EP.btn.left).html(left);
        });
    }

    EP.btn = {};
    EP.btn.emoji = '[data-ep-emoji]';
    EP.btn.edit = '[data-ep-edit]';
    EP.btn.input = '[data-ep-input]';
    EP.btn.left = '[data-ep-left]'
});

})(jQuery);


// var LeftSide = React.createClass({
//     render:function(){

//     }
// }) 

// ReactDOM.render(
// <LeftSide/>,
// document.getElementById('leftSide');
// );


/*临时数据*/
// var context = [[{
//     text:'归档对话',
//     func:function(){
//       console.log('归档对话');
//     }
//   },{
//     text:'静音',
//     func:function(){
//       console.log('静音');
//     }
//   },
//     {
//     text:'删除对话',
//     func:function(){
//       console.log('删除对话');
//     }
//   }
//   ]];
// $('.base-chatbox').smartMenu(context);
  
// $('.side-header-menu').smartMenu(context);