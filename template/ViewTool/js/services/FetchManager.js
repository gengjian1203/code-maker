/**
 * 接口请求管理器
 */
class FetchManager {
  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchManager();
    }
    return this.instance;
  }

  exec = async (url, param, extend) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: url,
        data: param,
        // async: false, // 设置同步。ajax默认异步
        // dataType: 'jsonp',
        // jsonp: 'callback', // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        // jsonpCallback: 'callback', // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        timeout: 20000,
        // contentType: 'application/json; charset=utf-8',
        success: (res) => {
          console.debug("fetch", url, `${JSON.stringify(param)}`, res);
          resolve(res);
        },
      });
    });
  };
}

export default FetchManager.getInstance();
