let config = {
  isWe: false, // 微信系列
  isWeChat: false, // 普通微信
  isWeCom: false, // 企业微信
};

// 渲染代码卡片
const renderCardCode = (arrList = [], langPage = "") => {
  arrList.forEach((item, index) => {
    const domCode =
      item &&
      item.content &&
      item.content
        .map((itemContent, indexContent) => {
          return `
        ${
          itemContent.title &&
          `<div class="flex-between-h content-card-item" key="content-card-header-${indexContent}">
            <div class="content-card-item-title">${itemContent.title}</div>
          </div>`
        }
        <div class="flex-between-h content-card-item">
          <pre class="prettyprint linenums Lang-${
            itemContent.lang
          } content-card-item-pre" key="content-card-pre-${indexContent}">
            ${formatCodeContent(itemContent.code)}
          </pre>
          <div class="code-copy" id="_code-copy-${langPage}-${index}-${indexContent}">复制</div>
        </div>
      `;
        })
        .join("\n        ");

    const domPreview = item.isPreview
      ? `
        <div class="flex-start-v content-card-preview">
          ${item.content
            .map((itemContent) => {
              return itemContent.code;
            })
            .join("\n        ")}
        </div>
      `
      : ``;

    $(`#_page-${langPage}`).append(`
      <div class="flex-between-h content-card">
        <div class="flex-start-v content-card-code">
          ${domCode}
        </div>
        ${domPreview}
      </div>
    `);
  });
};

// 注册卡片事件
const regCardCodeEventFunction = (arrList = [], langPage = "") => {
  arrList.forEach((item, index) => {
    item &&
      item.content &&
      item.content.map((itemContent, indexContent) => {
        $(`#_code-copy-${langPage}-${index}-${indexContent}`).bind(
          "click",
          itemContent,
          handleCodeCopyClick
        );
      });
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// 注册调试区域
const initConsole = () => {
  const vConsole = new VConsole();
  console.log(
    "vConsole",
    vConsole,
    `https://prod-5gkxku5cdb510bb2-1259256375.tcloudbaseapp.com/view_tool/index.html?t=${new Date().getTime()}`
  );
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
  renderCardCode(arrPageCssList, "css");
  regCardCodeEventFunction(arrPageCssList, "css");
};

// 初始化JS示例代码分页
const initPageJS = () => {
  renderCardCode(arrPageJsList, "js");
  regCardCodeEventFunction(arrPageJsList, "js");
};

window.onload = () => {
  console.log("Hello View Tool");
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
