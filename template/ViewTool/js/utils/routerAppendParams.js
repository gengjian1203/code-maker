import router2Params from "./router2Params";

/**
 * 构造路由字符串，可尾部追加传参
 * @param {string} strPath 原路由字符串
 * @param {object} objParams 参数对象
 * @param {string} order 参数覆盖优先级 'append' - 以追加参数优先级高 | 'source' - 以原路由携带参数优先级高
 * @returns 追加参数后的路由字符串
 */
export const routerAppendParams = (strPath, objParams, order = "append") => {
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

export default routerAppendParams;
