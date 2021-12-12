/**
 * 展示对应页面
 * @param {*} idPage
 */
const showPageContent = (idPage = arrConfigNavList[0].idPage) => {
  arrConfigNavList.forEach((item, index) => {
    if (item.idPage === idPage) {
      $(`#${item.id}`).addClass("active");
      // $(`#${item.idPage}`).addClass("in active fade");
      $(`#${item.idPage}`).show();
    } else {
      $(`#${item.id}`).removeClass("active");
      // $(`#${item.idPage}`).removeClass("in active");
      $(`#${item.idPage}`).hide();
    }
  });
};

/**
 * HTML转义
 * @param {*} html
 * @returns
 */
const encodeHTML = (html) => {
  var temp = document.createElement("div");
  temp.textContent !== null
    ? (temp.textContent = html)
    : (temp.innerText = html);
  var output = temp.innerHTML;
  temp = null;
  return output;
};

/**
 * 清除代码无意义的换行
 */
const formatCodeContent = (strCode) => {
  const result = strCode
    .replace(/\n          /g, "\n") // 去掉过多缩进
    .replace(/        \n$/g, ""); // 去掉末尾多于换行
  // console.log("formatCodeContent", result);
  return encodeHTML(result);
};

/**
 * 复制内容到剪贴板
 */
const setClipboardData = (strText) => {
  const oInput = document.createElement("textarea");
  oInput.value = strText;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  const resCommandCopy = document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.className = "oInput";
  oInput.style.display = "none";
  oInput.blur();
  if (resCommandCopy) {
    console.log("复制成功");
    return true;
  } else {
    console.error("复制失败");
    return false;
  }
};

/**
 * 弹出提示信息
 * @param {*} strTip
 * @param {*} strType
 * @param {*} duration
 */
const showTip = (strTip = "", strType = "success", duration = 1000) => {
  const idTip = `#_global-tip-${strType}`;
  const idTipText = `#_global-tip-${strType}-text`;
  $(idTipText).html(strTip);
  $(idTip).show();
  setTimeout(() => {
    $(idTip).hide();
  }, duration);
};
