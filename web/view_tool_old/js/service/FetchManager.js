// import { routerAppendParams } from "../utils";

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

  /**
   * 自定义请求
   * @param {*} url
   * @param {*} param
   * @param {*} extend
   * @returns
   */
  exec = async (url, params, extend) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: url,
        data: params,
        timeout: 20000,
        ...extend,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          resolve(res);
        },
        complete: (res) => {
          console.debug(
            "FetchManager exec compl",
            url,
            `${JSON.stringify(params)}`,
            `${JSON.stringify(extend)}`,
            res
          );
        },
      });
    });
  };

  /**
   * 接口GET请求
   */
  // fetchGET = async (url, params) => {
  //   return new Promise((resolve, reject) => {
  //     $.ajax({
  //       url: routerAppendParams(url, params),
  //       type: "GET",
  //       async: false, // 设置同步。ajax默认异步
  //       dataType: "jsonp",
  //       jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
  //       jsonpCallback: "callback", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
  //       timeout: 20000,
  //       contentType: "application/json; charset=utf-8",
  //       success: (res) => {
  //         resolve(res);
  //       },
  //       fail: (res) => {
  //         resolve(res);
  //       },
  //       complete: (res) => {
  //         console.debug(
  //           "FetchManager fetchGET",
  //           url,
  //           `${JSON.stringify(params)}`,
  //           res
  //         );
  //       },
  //     });
  //   });
  // };

  /**
   * 接口POST请求
   */
  // fetchPOST = async (url, params) => {
  //   return new Promise((resolve, reject) => {
  //     $.ajax({
  //       url: url,
  //       data: params,
  //       type: "POST",
  //       timeout: 20000,
  //       success: (res) => {
  //         resolve(res);
  //       },
  //       fail: (res) => {
  //         resolve(res);
  //       },
  //       complete: (res) => {
  //         console.debug(
  //           "FetchManager fetchGET",
  //           url,
  //           `${JSON.stringify(params)}`,
  //           res
  //         );
  //       },
  //     });
  //   });
  };
}

export default FetchManager.getInstance();
