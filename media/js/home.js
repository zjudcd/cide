$(function(){
  var root = $('#home');
  // 焦点广告图
  (function(){
     var slider = root.find('.slider'),
        banner = slider.find('.slider-list'),
        dot = slider.find('.dot-list'),
        bannerLink = banner.find('a'),
        start = 0,
        end = true,
        timer = null,
        second = 10,
        len = banner.children('div').length;

      //焦点图统计
      bannerLink.bind("click", function(){
        var index = $(this).closest("div").index() + 1;
        tlog = window.tlog || [];
        tlog.push('c:w_index_adframe_' + index);
      });

      banner.find('div:first').show().siblings().hide();
      var animate = function(i,callback){
        if(end){
          end = false;
          dot.find('a').eq(i).addClass('active').siblings().removeClass('active');
          banner.find('div').eq(i).siblings().fadeOut(600).end().fadeIn(1200,function(){
             end = true;
             if(callback) callback.call(this);
          });
        }
      };
      var autoPlay = function(){
        if(end){
          start++;
          if(start >= len)start=0;
          animate(start);  
          clearTimeout(timer);
          timer = setTimeout(autoPlay,second * 1000);
        }
      };
      var doTimer = function(){
        timer = setTimeout(autoPlay,second * 1000);
      };
      //add dotlist
      var html = '';
      for(var i=0; i<len; i++){
        html += '<a href="javascript:;"';
        if(i == 0){
          html += ' class="active"';
        }
        html += '></a>';  
      }
      dot.html(html).find('a').click(function(){
        var index = $(this).index();
        start = index;
        clearTimeout(timer);
        animate(index,function(){
          doTimer();
        });
      });
      doTimer(); 
  })();

  LT.File.Js.load("/p/beta2/js/plugins/jquery.placeholderui.js,/p/beta2/js/plugins/jquery.checkboxui.js", function(){
    $('[placeholder]').PlaceholderUI();
    $('input[type="checkbox"]').CheckboxUI();
    //登录注册tab切换
    var regLogin = function(){
      this.tab = $('.form-title',root);
      this.con = this.tab.siblings('.form-content');
      var w = parseInt(this.con.width(),10) + 2;
      this.sendGA = function(){
        var _flag = this.con.attr('data-flag'),
            _kind = this.tab.find('>.cur').attr('data-kind');
          if(_flag == 0){ // 如果是注册
            switch(Number(_kind)){
              case 0:
                tlog=window.tlog||[];
                tlog.push('s:w_box_register_c_new');
                break;
              case 1:
                tlog=window.tlog||[];
                tlog.push('s:w_box_register_e_new');
                break;
              case 2:
                tlog=window.tlog||[];
                tlog.push('s:w_box_register_h_new');
                break;
            }
          }else{ // 如果是登录
            switch(Number(_kind)){
              case 0:
                tlog=window.tlog||[];
                tlog.push('s:w_box_login_c_new');
                break;
              case 1:
                tlog=window.tlog||[];
                tlog.push('s:w_box_login_e_new');
                break;
              case 2:
                tlog=window.tlog||[];
                tlog.push('s:w_box_login_h_new');
                break;
            }
          }
      };
      this.tabSwitch = function(i){
        //this.con.children('div').hide();
        var _box = '.register-box',
            _left = -w,
            _flag = this.con.attr('data-flag'); //记录登陆注册状态 0 注册 1登陆
        _flag == 1 ? (_box = '.login-box',_left = w ) : ( _box = '.register-box',_left = -w );
        this.tab.find('span').eq(i).addClass('cur').siblings().removeClass('cur');
        this.con.children('div').eq(i).children(_box).css('left','0').siblings().css('left',_left+'px');
        this.con.children('div').eq(i).css('left','0').siblings().css('left','-584px');
        this.sendGA();// 统计
      };
      this.showWhich = function(){
        //用户类型
        var user_kind = LT.Cookie.get('user_kind') || 0;
        //用户登录注册
        this.con.attr('data-flag',(LT.User.user_login ? 1 : 0));
        this.tab.find('[data-kind="'+user_kind+'"]').trigger('click');
        var srId = LT.String.getQuery('sr_id'),
            srEmail = LT.String.getQuery('sr_email');
        if(!user_kind&&!LT.User.user_login&&srId&&srEmail){
          $('.candidate .register-box').attr('sr_id',srId).find('[data-selector="checkEmail"]').val(srEmail);
        }
      };
      this.lrswitch = function(ele){
        var _left = 0,_flag = 0;
        $(ele).hasClass('login-box') == true? (_flag = 0,_left = -w):(_flag = 1,_left = w);
        $(ele).animate({
          left:_left
        },200).siblings('form').animate({
          left:0
        },200);
        $(ele).closest('.form-content').attr('data-flag',_flag);
        this.sendGA();// 统计
      };
      this.init = function(){
        var that = this;
        that.tab.find('span').bind('click',function(){
          that.tabSwitch($(this).index());
        });
        $('[data-selector="switchRegister"],[data-selector="switchLogin"]').bind('click',function(){
          that.lrswitch($(this).closest('form'));
        });
        that.showWhich();
      }
    };
    new regLogin().init();
  });
  LT.File.Js.load("/p/beta2/js/plugins/jquery.validTip.js,/p/beta2/js/plugins/jquery.valid.js", function(){
    var cLoginForm = $('.candidate').find('.login-box'),
        cRegister = $('.candidate').find('.register-box'),
        hLoginForm =  $('.hunter').find('.login-box'),
        hRegister =  $('.hunter').find('.register-box'),
        bLoginform = $('.business').find('.login-box'),
        bRegister=  $('.business').find('.register-box');
    // 手机号注册新加
    var phoneCodeWrap = $('[data-selector="phone-code-wrap"]',cRegister),
        emailCodeWrap = $('[data-selector="email-code-wrap"]',cRegister),
        phoneCodeBtn = $('[data-selector="phone-code-btn"]',phoneCodeWrap).data('times',0),
        checkEmail = $('[data-selector="checkEmail"]',cRegister);
    // 倒计时
    function countdown(elm,time){
      if(!elm){
        return false;
      }
      var elm = elm,
          start = time || 60,
          timer = null;
      elm.removeClass('btn-primary').addClass('btn-disabled');
      (function(){
        start--;
        elm.html('重新获取（'+start+'）');
        if(start<=0){
          elm.removeClass('btn-disabled').addClass('btn-primary').html('重新获取');
          clearTimeout(timer);
          return false;
        }
        timer = setTimeout(arguments.callee,1000);
      })();
    }
    // 获取手机验证码
    phoneCodeBtn.bind('click',function(){
      if($(this).hasClass('btn-disabled')){
        return false;
      }
      if(!checkEmail.attr('data-valid')||checkEmail.attr('data-valid')=='false'){
        checkEmail.trigger("highlight", true).trigger('focus');
        return false;
      }
      var $this = $(this),
          times = $this.data('times')-0;
      if(LT.Cookie.get('phone_code_times')==1){
        countdown($this);
        return false;
      }
      if(times>=3){
        $this.data('times',0);
        LT.Cookie.set('phone_code_times',1,1/24/2);
        countdown($this);
        checkEmail.SimpleValidErrorTips('如果您一直无法收到验证码，请用邮箱注册');
        return false;
      }
      $.ajax({
        url:LT.Env.wwwRoot+'user/sendverifymessage',
        type:'POST',
        data:'newtel='+$.trim(checkEmail.val()),
        dataType:'json',
        success:function(data){
          if(data.flag==1){
            times++;
            $this.data('times',times);
            countdown($this);
          }else{
            $.dialog.error(data.msg);
          }
        },
        error:function(err){
          $.dialog.error(data.msg);
        }
      });
    });
    var changeCode = $('.changecode',root),
        validCode = changeCode.siblings('.validcode');
    changeCode.add(validCode).bind("click",function(){
      $(this).closest('form').find('.validcode').attr("src","/image/randomcode/?"+ Math.random());
      //validCode.attr("src","/image/randomcode/?"+ Math.random());
      return false;
    }); 
    cLoginForm.valid({
      scan:function(data){
        if(!data.valid){
          $.each(data.result, function(i,n){
            !n.valid && n.element.trigger("highlight", true);
          });
          data.firstError.element.triggerHandler("focus");
        }else{
          cLoginForm.find(".text-error").removeClass("text-error");
        }
      },
      success: function(){
        var $this = $(this),
            rUrl = LT.String.getQuery('url'),
            user_login = $("input[name='user_login']",$this),
            user_pwd = $("input[name='user_pwd']",$this),
            pwd = user_pwd.val();
        user_pwd.val(LT.String.md5(pwd));
        var  data = $this.serializeArray();
        user_pwd.val(pwd);
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data: data,
          dataType: "json",
          cache: false,
          success: function(data){
            switch(parseInt(data.flag)){
              case -1:
                if(data.err.indexOf("用户名") != -1){
                  user_login.SimpleValidErrorTips(data.err);
                } else if(data.err.indexOf("密码") != -1){
                  user_pwd.SimpleValidErrorTips(data.err);
                } else {
                  user_login.SimpleValidErrorTips(data.err);
                }
                break;
              case 1:
                rUrl?
                location.href = rUrl:
                location.href = LT.Env.wwwRoot + "home/";
                break;
              case 2:
                top.location.href = "/user/verificationfail/?user_email=" + data.user_email;
                break;
              case 3:
                top.location.href = "/user/regc/regprofile/?user_email=" + data.user_email;
                break;
              case 4:
                top.location.href = "/user/regc/regnamecard/?user_email=" + data.user_email;
                break;
              case 5:
                top.location.href = "/user/verificationfail/?user_email=" + data.user_email;
                break;
              case 0:
                user_login.SimpleValidErrorTips("您的账号已被禁用！");
                break;
              default:
                $.dialog.alert("发生未知错误，请与系统管理员联系，错误代码：(INDEX:LOGIN_"+ data.flag +")");
                break;
            }
          },
          mask:$(':submit',$this)
        });
        return false;
      }
    });
    cRegister.valid({
      scan:function(data){
        if(!data.valid){
          $.each(data.result, function(i,n){
            !n.valid && n.element.trigger("highlight", true);
          });
          data.firstError.element.triggerHandler("focus");
        }else{
          cRegister.find(".text-error").removeClass("text-error");
        }
      },
      dynrule:{
        "checkPhoneEmail":function(){
          if(LT.String.isEmail($(this).val())){
            emailCodeWrap.show().find('input').prop('disabled',false);
            phoneCodeWrap.hide().find('input').prop('disabled',true);
            return [['email','请输入正确的$'],['ajax','checkMailExist','该邮箱已注册，请更换邮箱']];//邮箱
          }else if(LT.String.isMobile($(this).val())){
            emailCodeWrap.hide().find('input').prop('disabled',true);
            phoneCodeWrap.show().find('input').prop('disabled',false);
            return [['phone','请输入正确的$']];//手机号
          }else{
            return [['phone','请输入正确的$'],['email','请输入正确的$']];
          }
        }
      },
      ajax: {
        "checkMailExist": {
          url: LT.Env.wwwRoot + "user/isuserexist/",
          data: function(){
            return { user_login: $('[data-selector="checkEmail"]',cRegister).val() };
          },
          dataType: "json",
          cache: false,
          success: function(data){
            if(data == 1){
              $('[data-selector="checkEmail"]',cRegister).trigger("highlight", true);
              return false;   // 验证未通过
            } else {
              return true;   // 验证通过
            }
          }
        }
      },
      success: function(){
        var $this = $(this);
        var _pw = $('[name="web_user.user_pwd"]', cRegister),
            _pw_val = _pw.val();
        if(/\b(000000|111111|11111111|112233|123123|123321|123456|12345678|654321|666666|888888|1234567)\b/.test(_pw_val)){
          _pw.SimpleValidErrorTips('密码安全度低，请更换密码');
          return false;
        }
        if(/"|'|<|>|\?|\%|\*/g.test(_pw_val)){
          _pw.SimpleValidErrorTips('请使用常用符号');
          return false;
        }
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data: $this.serializeArray(),
          dataType: "json",
          cache: false,
          success: function(data){
            if(data.success){
              var srId='';
              if(cRegister.attr('sr_id')){
                srId = '?sr_id='+cRegister.attr('sr_id');
              }
              window.location.href = "/user/regc/regnamecard/"+srId;
            } else {
              $("img.validcode",$this).trigger("click");
              if(data.msg.indexOf("验证码") >= 0) {
                $('input[name="rand"]',$this).filter(function(){
                  if(!this.disabled){return $(this)};
                }).SimpleValidErrorTips(data.msg);
              } else {
                $('[data-selector="checkEmail"]',$this).SimpleValidErrorTips(data.msg);
              }
            }
          },
          mask:$(':submit',$this)
        });
        return false;
      }
    });
    hLoginForm.valid({
      scan:function(data){
        if(!data.valid){
          $.each(data.result, function(i,n){
            !n.valid && n.element.trigger("highlight", true);
          });
          data.firstError.element.triggerHandler("focus");
        }else{
          hLoginForm.find(".text-error").removeClass("text-error");
        }
      },
      success: function(){
        var $this = $(this),
            rUrl = LT.String.getQuery('url'),
            user_pwd = $("input[name='user_pwd']",$this),
            pwd = user_pwd.val();
        user_pwd.val(LT.String.md5(pwd));
        var  data = $this.serializeArray();
        user_pwd.val(pwd);
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data: data,
          dataType: "json",
          cache: false,
          success: function(data){
            if(data.flag!=-1){
              rUrl?
              location.href = rUrl:
              location.href = LT.Env.wwwRoot + "/home/";
            }else{
              hLoginForm.find('[name="user_login"]').SimpleValidErrorTips(data.err);
            }
          },
          mask:$(':submit',$this)
        });
        return false;
      }
    });
    hRegister.valid({
      scan:function(data){
        if(!data.valid){
          $.each(data.result, function(i,n){
            !n.valid && n.element.trigger("highlight", true);
          });
          data.firstError.element.triggerHandler("focus");
        }else{
          hRegister.find(".text-error").removeClass("text-error");
        }
      },
      ajax: {
        "checkMailExist": {
          url: LT.Env.wwwRoot + "user/isuserexist/",
          data: function(){
            return { user_login: hRegister.find('input[name="user_login"]').val() };
          },
          dataType: "json",
          cache: false,
          success: function(data){
            if(data == 1){
              hRegister.find('input[name="user_login"]').trigger("highlight", true);
              return false;   // 验证未通过
            } else {
              return true;   // 验证通过
            }
          }
        },
        "checkMobileExist":{
          url: LT.Env.wwwRoot + "user/isuserhtelexist/",
          data: function(){
            return { h_tel: hRegister.find('input[name="h_tel"]').val() };
          },
          dataType: "json",
          cache: false,
          success: function(data){
            if(data == 1){
              hRegister.find('input[name="h_tel"]').trigger("highlight", true);
              return false;   // 验证未通过
            } else {
              return true;   // 验证通过
            }
          }
        }
      },
      success: function(){
        var $this = $(this);
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data: $this.serializeArray(),
          dataType: "json",
          cache: false,
          success: function(data){
            if(data.success){
              window.location.href = LT.Env.hRoot + "certification/home/?register=1" +"&"+ Math.random();
            } else {
              if(data.msg.indexOf('邮箱') != -1){
                $('[name="user_login"]',$this).SimpleValidErrorTips(data.msg);
              }else if(data.msg.indexOf('手机') != -1){
                $('[name="h_tel"]',$this).SimpleValidErrorTips(data.msg);
              }else{
                $.dialog.error(data.msg);
              }
            }
          },
          mask:$(':submit',$this)
        });
        return false;
      }
    });
    bLoginform.valid({
      scan:function(data){
        if(!data.valid){
          $.each(data.result, function(i,n){
            !n.valid && n.element.trigger("highlight", true);
          });
          data.firstError.element.triggerHandler("focus");
        }else{
          bLoginform.find(".text-error").removeClass("text-error");
        }
      },
      success: function(){
        var $this = $(this),
            rUrl = LT.String.getQuery('url'),
            user_pwd = $("input[name='user_pwd']",$this),
            pwd = user_pwd.val();
        user_pwd.val(LT.String.md5(pwd));
        var  data = $this.serializeArray();
        user_pwd.val(pwd);
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data:data,
          dataType: "json",
          cache: false,
          success: function(data){
            switch(parseInt(data.flag)){
              case -1:
                data.err.indexOf('用户名') != -1?
                $('[name="user_login"]',$this).SimpleValidErrorTips(data.err):
                $.dialog.frize(data.err);
                break;
              case 1:
                rUrl?
                location.href = rUrl:
                location.href = LT.Env.wwwRoot + "/home/";          
                break;
              case 2:
                location.href = LT.Env.wwwRoot + "/user/verificationfail/?user_email=" + data.user_email;
                break;
              case 3:
                location.href = LT.Env.wwwRoot + "/user/regc/regprofile/?user_email=" + data.user_email;
                break;
              case 4:
                location.href = LT.Env.wwwRoot + "/user/regc/regnamecard/?user_email=" + data.user_email;
                break;
              case 5:
                location.href = LT.Env.wwwRoot + "/user/verificationfail/?user_email=" + data.user_email;
                break;
              case 0:
                bLoginform.find('[name="user_login"]').SimpleValidErrorTips("您的账号已被禁用！");
                break;
              default:
                $.dialog.error("发生未知错误，请与系统管理员联系，错误代码：(INDEX:LOGIN_"+ data.flag +")");
                break;
            }
          },
          mask:$(':submit',$this)
        });
        return false;
      }
    });
    bRegister.valid({
      scan:function(data){
        if(!data.valid){
          $.each(data.result, function(i,n){
            !n.valid && n.element.trigger("highlight", true);
          });
          data.firstError.element.triggerHandler("focus");
        }else{
          bRegister.find(".text-error").removeClass("text-error");
        }
      }, 
      ajax: {
        "checkUserNameExist": {
          url: LT.Env.wwwRoot + "user/checkEUserloginExist/",
          data: { user_login: bRegister.find('input[name="web_user.user_login"]').val() },
          dataType: "json",
          cache: false,
          success: function(data){
            if(data.flag == 1){
              bRegister.find('input[name="web_user.user_login"]').trigger("highlight", true);
              return false;   // 验证未通过
            } else {
              return true;   // 验证通过
            }
          }
        }
      },
      success: function(){
        var $this = $(this);
        $.ajax({
          url: $this.attr("action"),
          type: $this.attr("method"),
          data: $this.serializeArray(),
          dataType: "json",
          cache: false,
          success: function(data){
            if(data.success){
              $.dialog.frize(data.msg, function(){
                location.href = LT.Env.lptRoot+'?reg=1&uname='+$.trim($('input[name="web_user.user_login"]',$this).val());
              }).time(3);
            } else {
              if(data.msg.indexOf('验证码') != -1){
                $('.validcode',$this).attr("src", LT.Env.wwwRoot+"image/randomcode/?" + Math.random());
                $('input[name="rand"]',$this).SimpleValidErrorTips(data.msg);
              }else if(data.msg.indexOf('用户') != -1){
                $('input[name="web_user.user_login"]',$this).SimpleValidErrorTips(data.msg);
              }else{
                $.dialog.error(data.msg);
              }
            }
          },
          mask:$(':submit',$this)
        });
        return false;
      }
    });
    $("[validate-rules]", root).SimpleValidTips();
  });
});

/********scrollBar*********/
$(function(){
  function ScrollBar(){
    if(LT.Browser.IE6){return}
    var html = '<div id="scrollBar" class="scroll-bar">'+
            '<ul></ul>'+
            '<a class="back-top" href="#"><i></i><b></b><span class="hide">回到顶部</span></a>'+
          '</div>';
    this.tplMain = $(html);
    var dataArray = [];
    $('h2[data-selecter="scroll"]').each(function(){
      dataArray.push({
        id:$(this).attr('id'),
        name:$(this).attr('data-name')
      })
    });
    this.init(dataArray);
  }
  ScrollBar.prototype = {
    init:function(dataArray){
      var _this = this,
        opts = {},
        valArray = [],
        idArray = [],
        dataArray = dataArray||[];
      dataArray.forEach(function(val,index){
        _this.tplMain.find('ul').append('<li><a id="'+val.id+'-btn" href="#'+val.id+'">'+val.name+'</a></li>');
        opts[val.id] = $('#'+val.id).offset().top;
        valArray.push(opts[val.id]);
      });
      valArray = valArray.sort(function(a,b){
        return parseInt(a,10)>parseInt(b,10)
      });
      valArray.forEach(function(val,index){
        for(var i in opts){
          if(val == opts[i]){
            idArray[index] = i;
            break;
          }
        }
      });
      _this.tplMain.appendTo('body');
      _this.opts = opts;//模块id对应offsetTop的对象 例:{hotPost:800,hotPost2:600,hotPost3:1000}
      _this.valArray = valArray;//每个模块offsetTop的数组
      _this.idArray = idArray;//每个模块id的数组
      _this.lastPostion = $('#'+_this.idArray[_this.idArray.length-1]).parent().offset().top+$('#'+_this.idArray[_this.idArray.length-1]).parent().outerHeight()-10;
      _this.nowId = '';//当前的模块id
      _this.lock = false;//页面刷新只执行一次定位
      _this.bind();
    },
    bind:function(){
      var _this = this;
      $(window).bind('load resize scroll',function(e){
        var top = $(window).scrollTop();
        _this.doMove(top,e);
      });
    },
    doMove:function(top,e){
      if($(window).width()<980+180){
        if(this.tplMain.is(':visible')){
          this.tplMain.fadeOut(200);
        }
        return;
      }
      if(!this.lock||e.type !='scroll'){
        if(!this.lock){this.lock = true;}
        this.tplMain.css('right',($(window).width()-980)/2-90);
      }
      var _this = this,
          top = top+150,
          nowId = '';
      if(top>_this.valArray[0]){
        if(top-150+_this.tplMain.outerHeight()+90>=_this.lastPostion){
          _this.tplMain.css({'position':'absolute','top':_this.lastPostion-_this.tplMain.outerHeight()});
        }else{
          _this.tplMain.css({'position':'fixed','top':90});
        }
        if(_this.tplMain.is(':hidden')){
          _this.tplMain.fadeIn(200);
        }
      }else{
        _this.tplMain.fadeOut(200);
        return;
      }
      for(var i=0;i<_this.valArray.length;i++){
        if(top>=_this.valArray[i]){
          nowId = _this.idArray[i];
        }else{
          break;
        }
      }
      if(nowId == _this.nowId){return;}
      _this.nowId = nowId;
      _this.tplMain.find('li a').removeClass('select');
      $('#'+_this.nowId+'-btn').addClass('select');
    }
  }
  ScrollBar.prototype.constructor = ScrollBar;
  new ScrollBar;
});

// guider
$(function(){
  LT.File.Js.load('/p/beta2/js/page/slide.guider.js', function(){
    !LT.User.user_login && LT.Cookie.get("slide_guide_home") != 1 && LT.File.Js.load('/p/beta2/js/page/slide.guider.js', function(){
      slideGuider({
        second: 3,
        close:function(){
          LT.Cookie.set("slide_guide_home","1");
        }
      });
    });
  });
});
// 新旧首页统计区分
tlog=window.tlog||[];
tlog.push('s:wwwindex_new');
$(function(){
  $('.candidate .register-box .btn-register').bind('click',function(){
    tlog=window.tlog||[];
    tlog.push('c:w_box_register_c_new');
  });
})
