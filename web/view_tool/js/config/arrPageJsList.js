// console.log(\`距离${target}，还剩${d}天${h}小时${m}分${s}秒\`);
// console.log('距离' + target + '，还剩' + d + '天' + h + '小时' + m + '分' + s + '秒');
const arrPageJsList = [
  {
    isPreview: false,
    content: [
      {
        title: "路由/传参对象相关转换",
        lang: "js",
        code: `
          /**
           * 路由字符串，转换为对象
           * @param {*} strRouter 完整路由+参数字符串
           * @returns 拆分路由+参数
           */
          let router2Params = (strRouter) => {
            const strRouterTmp = strRouter || "";
            let strResultPath = strRouterTmp;
            const objResultParam = {};
          
            const nIndexPath = strRouterTmp.indexOf("?");
            if (nIndexPath >= 0) {
              strResultPath = strRouterTmp.substring(0, nIndexPath);
              const strParam = strRouterTmp.slice(nIndexPath + 1);
              const arrParam = strParam.split("&");
          
              arrParam.forEach((strItem) => {
                const nIndexParam = strItem.indexOf("=");
                if (nIndexParam >= 0) {
                  const strParamKey = strItem.substring(0, nIndexParam);
                  const strParamValue = strItem.slice(nIndexParam + 1);
                  objResultParam[strParamKey] = strParamValue;
                }
              });
            }
          
            return {
              path: strResultPath,
              params: objResultParam,
            };
          }

          /**
           * 构造路由字符串，可尾部追加传参
           * @param {string} strPath 原路由字符串
           * @param {any} objParams 参数对象
           * @param {
           *    {string} order 参数覆盖优先级 'append' - 以追加参数优先级高 | 'source' - 以原路由携带参数优先级高
           *    {boolean} encode 参数是否编码 true - 将参数编码 | false - 将参数不编码
           * } objExtend 拓展功能对象
           * @returns 追加参数后的路由字符串
           */
          let routerAppendParams = (
            strPath = '',
            objParams = {},
            objExtend = {},
          ) => {
            const { order = "append", encode = true } = objExtend || {};
            const { path: sourcePath, params: sourceParams } = router2Params(strPath);
            // console.log("routerAppendParams", sourcePath, sourceParams);
            let strResult = sourcePath;
            let mergeParams =
              order === "append"
                ? {
                    ...sourceParams,
                    ...objParams, // 以追加参数优先级高
                  }
                : {
                    ...objParams,
                    ...sourceParams, // 以原路由携带参数优先级更高
                  };

            if (sourcePath && mergeParams && JSON.stringify(mergeParams) !== "{}") {
              let isFirstParam = !sourcePath.includes("?");
              Object.keys(mergeParams).forEach((key) => {
                if (isFirstParam) {
                  strResult += \`?\${key}=\${
                    encode ? encodeURIComponent(mergeParams[key]) : mergeParams[key]
                  }\`;
                  isFirstParam = false;
                } else {
                  strResult += \`&\${key}=\${
                    encode ? encodeURIComponent(mergeParams[key]) : mergeParams[key]
                  }\`;
                }
              });
            }
            return strResult;
          }
        `,
      },
      {
        title: "路由字符串转换为对象 使用示例",
        lang: "js",
        code: `
          router2Params('/pages/ArticleDetail/index?type=ZHIHU&articleId=1234567890')
        `,
      },
      {
        title: "对象转换为路由字符串 使用示例",
        lang: "js",
        code: `
          routerAppendParams("/pages/ArticleDetail/index?type=DEFAULT&uuid=a0b1c2", {
            type: "ZHIHU",
            articleId: "1234567890",
          }, {
            order: 'source'
          });
        `,
      },
    ],
  },
  {
    isPreview: false,
    content: [
      {
        title: "获取指定时间字符串",
        lang: "js",
        code: `
          /**
           * 获取指定时间字符串
           * @param date Date();
           * @return
           */
          let getStringDate = (date = new Date()) => {
            const YYYY = String(date.getFullYear());
            const MM = String(date.getMonth() + 1).padStart(2, "0");
            const DD = String(date.getDate()).padStart(2, "0");
            const hh = String(date.getHours()).padStart(2, "0");
            const mm = String(date.getMinutes()).padStart(2, "0");
            const ss = String(date.getSeconds()).padStart(2, "0");
          
            const timeString = \`\${YYYY}-\${MM}-\${DD} \${hh}:\${mm}:\${ss}\`;
            const monthString = \`\${YYYY}-\${MM}\`;
            const dayString = \`\${YYYY}-\${MM}-\${DD}\`;
          
            return {
              date,
              YYYY,
              MM,
              DD,
              hh,
              mm,
              ss,
              timeString: timeString,
              monthString: monthString,
              todayString: dayString,
            };
          };
        `,
      },
      {
        title: "获取指定时间字符串 使用示例",
        lang: "js",
        code: `
          getStringDate()
        `,
      },
    ],
  },
  {
    isPreview: false,
    content: [
      {
        title: "开启倒计时",
        lang: "js",
        code: `
          let time = 0
          let showTime = (target, YYYY, MM, DD, hh, mm, ss) => {
            const d2 = new Date(YYYY, MM - 1, DD, hh, mm, ss);
            const d0 = new Date();
            let ts = d2 - d0;
            if (ts > 0) {
              const d = Math.floor(ts / 86400000)
              ts = ts % 8640000
              const h = Math.floor(ts / 3600000);
              const m = Math.floor((ts / 60000) % 60);
              const s = Math.floor((ts / 1000) % 60);
              console.log(\`距离\${target}，还剩\${d}天\${h}小时\${m}分\${s}秒\`);
            }
          }
          time = setInterval(() => {showTime('过年', 2022, 2, 1, 00, 00, 00)}, 1000)
        `,
      },
      {
        title: "结束倒计时",
        lang: "js",
        code: `
          clearInterval(time)
        `,
      },
    ],
  },
];
