/**
 * 展示对应页面
 * @param {*} idPage
 */
const showPageContent = (idPage = arrConfigNavList[0].idPage) => {
  arrConfigNavList.forEach((item, index) => {
    if (item.idPage === idPage) {
      $(`#${item.id}`).addClass("active");
      $(`#${item.idPage}`).addClass("in active");
      // $(`#${item.idPage}`).show();
    } else {
      $(`#${item.id}`).removeClass("active");
      $(`#${item.idPage}`).removeClass("in active");
      // $(`#${item.idPage}`).hide();
    }
  });
};
