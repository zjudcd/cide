;(function($){

var HeaderHelper = function(){
  this.option = {
    showMessagePops: true     // 显示顶部气泡提醒
  };
  this.quickMenu = $('header .quick-menu');
  this.config = window.HeaderHelperConfig || {};
  this.init();
  return this;
};

HeaderHelper.prototype.init = function(){
  var that = this;
  LT.Event.queue("login", function(){
    that.refresh();
  });
  this.refresh();
  return this;
};

HeaderHelper.prototype.options = function(){
  var that = this;
  if(arguments.length === 1){
    return that.option[arguments[0]];
  } else if(arguments.length === 2){
    that.option[arguments[0]] = arguments[1];
  }
  return this;
};

HeaderHelper.prototype.refresh = function(){
  var alishost = location.hostname.split('.').slice(0, 1)[0];
  switch(alishost){
    case 'clt':
    case 'ltcom':
      if(!LT.Cookie.get("hcomp_id")){
        this.setUnloginMenuCLT();
      } else {
        this.setLoginedMenuCLT();
      }
      break;
    default:
      if(!LT.User.isLogin){
        this.setUnloginMenu();
      } else {
        this.setLoginedMenu();
      }
      break;
  }
  return this;
};

HeaderHelper.prototype.setUnloginMenu = function(){
  var that = this;
  var quickMenu = $('<div />').addClass('quick-menu-unlogined').appendTo(that.quickMenu.empty());
  NodeTpl.get('/tpls/www/beta2/header/quick_menu.js', {
    pageType: that.config.pageType
  }, function(d){
    quickMenu.append(d);
  });
  return that;
};

HeaderHelper.prototype.setLoginedMenu = function(){
  switch(LT.User.user_kind){
    case "0":
      //经理人
      this.setLoginedMenuC();
      break;
    case "2":
      //猎头
      this.setLoginedMenuH();
      break;
    default:
      this.setLoginedMenuP();
      // 企业
  }
  return this;
};

HeaderHelper.prototype.setLoginedMenuC = function(){
  var that = this;
  var quickMenu = $('<div />').addClass('quick-menu-logined-c').appendTo(that.quickMenu.empty());
  NodeTpl.get('/tpls/c/beta2/header/quick_menu.js', function(d){
    quickMenu.append(d);
  });
  return that;
};

HeaderHelper.prototype.setLoginedMenuH = function(){
  var that = this;
  var quickMenu = $('<div />').addClass('quick-menu-logined-h').appendTo(that.quickMenu.empty());
  NodeTpl.get('/tpls/h/beta2/header/quick_menu.js', function(d){
    quickMenu.append(d);
  });
  return that;
};

HeaderHelper.prototype.setUnloginMenuCLT = function(){
  var that = this;
  var quickMenu = $('<div />').addClass('quick-menu-unlogined').appendTo(that.quickMenu.empty());
  NodeTpl.get('/tpls/clt/beta2/header/quick_menu_unlogined.js', function(d){
    quickMenu.append(d);
  });
  $('header .notebook').remove();
  return that;
};

HeaderHelper.prototype.setLoginedMenuCLT = function(){
  var that = this;
  var quickMenu = $('<div />').addClass('quick-menu-logined-clt').appendTo(that.quickMenu.empty());
  var isroot = LT.Cookie.get("is_root_hcomp") == 1, compname = LT.Cookie.get("hcomp_name");
  NodeTpl.get('/tpls/clt/beta2/header/quick_menu.js', {
    isroot: isroot
  }, function(d){
    quickMenu.append(d);
  });
  if(compname){
    $('header nav').show();
    $('header .title').hide();
  } else {
    $('header nav').hide();
    $('header .title').show();
  }
  return that;
};

HeaderHelper.prototype.setLoginedMenuP = function(){
  var that = this;
  var quickMenu = $('<div />').addClass('quick-menu-logined-p').appendTo(that.quickMenu.empty());
  NodeTpl.get('/tpls/p/beta2/header/quick_menu.js', function(d){
    quickMenu.append(d);
  });
  return that;
};

HeaderHelper.prototype.navbar = function(name){
  $("header nav ul li").each(function(){
    $(this).attr("data-name") === name && $(this).addClass("active");
  });
  return this;
};

HeaderHelper.prototype.dynmode = function(name){
  LT.User.isLogin && $("header nav").hide();
  return this;
};

window.HeaderHelper = new HeaderHelper();

//LT.Message.send
//HeaderHelper.get('/')
})(jQuery);