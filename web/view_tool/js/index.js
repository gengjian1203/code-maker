let config = {
  isWe: false, // 微信系列
  isWeChat: false, // 普通微信
  isWeCom: false, // 企业微信
};

// 渲染代码卡片
const renderCardCode = (arrList) => {
  arrList.forEach((item, index) => {
    const domCode = `
      <div class="flex-start-v content-card-code">
        <div class="flex-between-h content-card-item">
          <div class="content-card-item-title">${item.title}</div>
          <div class="code-copy" id="_code-copy-${
            item.lang
          }-${index}">复制</div>
        </div>
        <pre class="prettyprint linenums Lang-${item.lang}">
          ${formatCodeContent(item.content)}
        </pre>
      </div>
    `;
    const domPreview = item.isPreview
      ? `
        <div class="flex-start-v content-card-preview">
          Preview...
        </div>
      `
      : ``;

    $(`#_page-${item.lang}`).append(`
      <div class="flex-between-h content-card">
        ${domCode}${domPreview}
      </div>
    `);
    $(`#_code-copy-${item.lang}-${index}`).bind(
      "click",
      item,
      handleCodeCopyClick
    );
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// 注册调试区域
const initConsole = () => {
  const vConsole = new VConsole();
  console.log("vConsole", vConsole);
};

// 初始化页面
const initConfig = () => {
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
  console.log("initConfig", config);
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

// 初始化CSS示例代码分页
const initPageCSS = () => {
  renderCardCode(arrPageCssList);
};

// 初始化JS示例代码分页
const initPageJS = () => {
  renderCardCode(arrPageJsList);
};

window.onload = () => {
  console.log("hello view Tool1");
  // alert("hello view Tool2");
  initConsole();
  initConfig();
  initNav();
  initPageCSS();
  initPageJS();
  regEventFunction();
  // 高亮格式化代码，放到最后
  prettyPrint();
};
