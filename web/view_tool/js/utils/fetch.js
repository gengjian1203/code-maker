const fetchGET = async (...arg) => {
  if (true) {
    return await fetchAjaxGET(...arg);
  } else {
    return await fetchAxiosGET(...arg);
  }
};

const fetchPOST = async (...arg) => {
  if (true) {
    return await fetchAjaxPOST(...arg);
  } else {
    return await fetchAxiosPOST(...arg);
  }
};

const fetchAxiosGET = async (url) => {
  const res = await axios.get(url);
  console.log("fetchGET", res);
  return res;
};

const fetchAxiosPOST = async (url, data) => {
  const res = await axios.post(url, data);
  console.log("fetchPOST", res);
  return res;
};

/**
 * 接口GET请求(Ajax)
 */
const fetchAjaxGET = (url) => {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: url,
        type: "GET",
        async: false, // 设置同步。ajax默认异步
        dataType: "jsonp",
        jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        jsonpCallback: "callback", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        timeout: 20000,
        contentType: "application/json; charset=utf-8",
        complete: (res) => {
          console.log("fetchGET", res);
          resolve(res);
        },
      });
    } catch (e) {
      resolve(e);
    }
  });
};

/**
 * 接口POST请求(Ajax)
 */
const fetchAjaxPOST = (url, data) => {
  return new Promise((resolve, reject) => {
    try {
      $.ajax({
        url: url,
        data: data,
        type: "POST",
        timeout: 20000,
        complete: (res) => {
          console.log("fetchPOST", res);
          resolve(res);
        },
      });
    } catch (e) {
      console.log("fetchPOST catch", e);
      resolve(e);
    }
  });
};
