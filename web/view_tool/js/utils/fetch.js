/**
 * 接口GET请求
 */
const fetchGET = async (url) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "GET",
      async: false, // 设置同步。ajax默认异步
      dataType: "jsonp",
      jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
      jsonpCallback: "callback", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
      timeout: 20000,
      contentType: "application/json; charset=utf-8",
      success: (res) => {
        resolve(res);
      },
    });
  });
};

/**
 * 接口POST请求
 */
const fetchPOST = async (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      data: data,
      type: "POST",
      timeout: 20000,
      success: (res) => {
        resolve(res);
      },
      complete: (res) => {
        console.log("fetchPOST", res);
      },
    });
  });
};
