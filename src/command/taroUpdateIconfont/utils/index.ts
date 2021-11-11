import axios from "axios";
const fs = require("fs");

/**
 * 发起请求网络获取iconfont样式内容
 * @param url
 */
export const queryIconfontResponse = async (url: string) => {
  const response = await axios.get(url);
  // console.log("queryIconfontResponse", response);
  return response.data
    .replace(/\"/g, "'") // 双引号转义单引号
    .replace(/  /g, "\t") // 双空格转义tab
    .replace(/\n$/g, ""); // 删除最后的回车换行
};

/**
 * 将获取的样式内容拆分的两部分
 * @param data
 */
export const spliceIconfontData = (data: string) => {
  const nIndex = data.indexOf(".iconfont {");
  const head = data.substring(0, nIndex);
  const tail = data.substring(nIndex);
  // console.log("spliceIconfontData0", nIndex);
  // console.log("spliceIconfontData1", head);
  // console.log("spliceIconfontData2", tail);
  return {
    head,
    tail,
  };
};

/**
 * 获取Iconfont模板的数据
 * @param strPath
 */
export const getIconfontTemplate = (strPath: string) => {
  // 读取文件内容
  let template = fs.readFileSync(strPath, "utf-8");
  return template;
};

/**
 * 写入Icon的less文件
 * @param strIconfontParh 写入文件路径
 * @param objIconfontData 获取的iconfont样式内容
 * @param strIconfontTemp 获取vant模板的数据
 */
export const writeIconfontFile = (
  strIconfontParh: string,
  objIconfontData: any,
  strIconfontTemp: string
) => {
  const strContent =
    `${objIconfontData.head}` +
    `${strIconfontTemp}` +
    `\n` +
    `${objIconfontData.tail}`;
  // console.log("writeIconfontFile", objIconfontData);

  // 保护写入文件时有对应的路径支持
  const nDistDirEnd = strIconfontParh.lastIndexOf("/");
  const pathDistDir = strIconfontParh.substr(0, nDistDirEnd);
  if (!fs.existsSync(pathDistDir)) {
    fs.mkdirSync(pathDistDir);
  }
  // 写入文件内容
  fs.writeFileSync(strIconfontParh, strContent);
};

export default {
  queryIconfontResponse,
  spliceIconfontData,
  getIconfontTemplate,
  writeIconfontFile,
};
