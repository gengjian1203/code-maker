let config = {
  isWe: false, // 微信系列
  isWeChat: false, // 普通微信
  isWeCom: false, // 企业微信
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// 注册调试区域
const initConsole = () => {
  const vConsole = new VConsole();
  console.log("vConsole", vConsole);
};

// 初始化页面
const initPage = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  $("#_page-user-agent").text(userAgent);
  config = {
    ...config,
    isWe: userAgent.includes("micromessenger"),
    isWeChat:
      userAgent.includes("micromessenger") && !userAgent.includes("wxwork"),
    isWeCom:
      userAgent.includes("micromessenger") && userAgent.includes("wxwork"),
  };
  console.log("initPage", config);
};

// 初始化顶部导航
const initNav = () => {
  $("#_page-nav").empty();
  arrConfigNavList.forEach((item) => {
    $("#_page-nav").append(`<li id='${item.id}'><a>${item.title}</a></li>`);
    $(`#${item.id}`).bind("click", item, handleNavItemClick);
  });
  showPageContent();
};

window.onload = () => {
  console.log("hello view Tool1");
  // alert("hello view Tool2");

  initConsole();
  initPage();
  initNav();
  regEventFunction();
};
