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
 * 清除代码无意义的换行
 */
const formatCodeContent = (strCode) => {
  const result = strCode
    .replace(/\n    /g, "\n") // 去掉过多缩进
    .replace(/\n$/g, ""); // 去掉末尾多于换行
  console.log("formatCodeContent", result);
  return result;
};
