/**
 * 展示对应页面
 * @param {*} idPage
 */
const showPageContent = (idPage = arrConfigNavList[0].idPage) => {
  arrConfigNavList.forEach((item, index) => {
    if (item.idPage === idPage) {
      $(`#${item.idPage}`).show();
    } else {
      $(`#${item.idPage}`).hide();
    }
  });
};
