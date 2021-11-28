/**
 * 路由字符串，转换为对象
 * @param {*} strRouter 完整路由+参数字符串
 * @returns 拆分路由+参数
 */
const router2Params = (strRouter) => {
  const strRouterTmp = strRouter || "";
  let strResultPath = strRouterTmp;
  const objResultParam = {};

  const nIndexPath = strRouterTmp.indexOf("?");
  if (nIndexPath >= 0) {
    strResultPath = strRouterTmp.substring(0, nIndexPath);
    const strParam = strRouterTmp.slice(nIndexPath + 1);
    const arrParam = strParam.split("&");
    // console.log('router2Params', strResultPath, strParam, arrParam)

    arrParam.forEach((strItem) => {
      const nIndexParam = strItem.indexOf("=");
      if (nIndexParam >= 0) {
        const strParamKey = strItem.substring(0, nIndexParam);
        const strParamValue = strItem.slice(nIndexParam + 1);
        objResultParam[strParamKey] = strParamValue;
      }
    });
  }
  // console.log('router2Params', objResultParam)

  return {
    path: strResultPath,
    params: objResultParam,
  };
};

/**
 * 构造路由字符串，可尾部追加传参
 * @param {string} strPath 原路由字符串
 * @param {object} objParams 参数对象
 * @param {string} order 参数覆盖优先级 'append' - 以追加参数优先级高 | 'source' - 以原路由携带参数优先级高
 * @returns 追加参数后的路由字符串
 */
const routerAppendParams = (strPath, objParams, order = "append") => {
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
        strResult += `?${key}=${mergeParams[key]}`;
        isFirstParam = false;
      } else {
        strResult += `&${key}=${mergeParams[key]}`;
      }
    });
  }
  return strResult;
};

/**
 * 获取指定时间字符串
 * @param date Date();
 * @return
 */
const getStringDate = (date = new Date()) => {
  const YYYY = String(date.getFullYear());
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  const timeString = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
  const monthString = `${YYYY}-${MM}`;
  const dayString = `${YYYY}-${MM}-${DD}`;
  // console.log("getNowDate", todayString);

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
