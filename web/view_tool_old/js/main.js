try {
  require.config({
    //通过此次配置后，我们可以在各个子模块中使用下面的文件库
    baseUrl: "js",
    paths: {
      jquery: "./lib/jquery-3.6.0.min.js",
      VConsole: "./lib/vconsole.min.js",
      FetchManager: "./service/FetchManager.js",
    },
    // shim: {
    //   angular: {
    //     exports: "angular",
    //     deps: ["jquery"],
    //   },

    //   "zh-cn": {
    //     deps: "kindeditor-all",
    //   },
    //   "ui-router": {
    //     deps: ["angular"],
    //   },
    //   "angular-locale_zh-cn": {
    //     deps: ["angular"],
    //   },
    //   "ng-bootstrap": {
    //     deps: ["angular", "angular-locale_zh-cn"],
    //   },
    //   rap: {
    //     deps: ["angular"],
    //   },
    //   nganimate: {
    //     deps: ["angular"],
    //   },
    //   statehelper: {
    //     deps: ["ui-router"],
    //   },
    //   "ng-require": {
    //     deps: ["angular"],
    //   },
    // },
    // waitSeconds: 15,
  });

  // require(["angular", "env", "app", "router", "ctrl/rootctrl"], function (
  //   angular,
  //   env,
  //   app,
  //   router
  // ) {
  //   //参数列表是将模块引入
  //   if (env == "dev") {
  //     document.domain = "localhost";
  //   } else if (env == "test") {
  //     document.domain = "two.cn";
  //   } else if (env == "production") {
  //     document.domain = "three.com";
  //   }

  //   angular.bootstrap(document, ["myapp"]);
  // });
} catch (e) {
  window.location.href = "/errors/ie8.html";
}
