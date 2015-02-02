if (LT.User.isLogin) window.location.href = LT.Env.wwwRoot + 'home/?r=' + Math.random();
(function(referrer) {
  if (referrer && !LT.User.isLogin && (referrer.indexOf('hao123.com') != -1 || referrer.indexOf('hao222.com') != -1)) {
    location.href = LT.Env.wwwRoot + 'event/landingpage/gain1.shtml?mscid=t_d_015';
  }
})(document.referrer);