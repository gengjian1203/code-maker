import * as vscode from "vscode";
const fs = require("fs");

/**
 * 解析文件路由相关信息
 * @param pathSource
 */
export const dealFileInfo = (pathSource: string) => {
  const nIndexDir = pathSource.lastIndexOf("/");
  if (nIndexDir < 0) {
    vscode.window.showInformationMessage("Error dir:", pathSource);
    return false;
  }
  const path = pathSource.substr(0, nIndexDir + 1);
  const file = pathSource.substr(nIndexDir + 1);
  const nIndexDot = file.lastIndexOf(".");
  if (nIndexDot < 0) {
    vscode.window.showInformationMessage("Error dot:", file);
    return false;
  }
  const fileName = file.substr(0, nIndexDot);
  const fileExt = file.substr(nIndexDot + 1);
  return {
    path,
    file,
    fileName,
    fileExt,
  };
};

/**
 * 解析普通className样式
 * @param content
 */
export const getArrClassNameListNormal = (content: string) => {
  let arrClassNameListNormal: any = content.match(
    /(?<=(className='|className=")).*?(?=(' |" |'>|">))/g
  );
  arrClassNameListNormal = arrClassNameListNormal?.map((item: string) => {
    return item.split(" ");
  });
  arrClassNameListNormal = [].concat(
    ...arrClassNameListNormal.map((item: Array<string>) => {
      return item;
    })
  );
  return arrClassNameListNormal;
};

/**
 * 解析classnames库样式
 * @param content
 */
export const arrClassNameListLibWrap = (content: string) => {
  let arrClassNameListLibWrap: any =
    content.match(/(?<=(className={classnames\({))[^]*?(?=(}\)}))/g) || [];
  let arrClassNameListLib: any = [];
  // console.log('arrClassNameListLib0', arrClassNameListLibWrap)
  for (let item of arrClassNameListLibWrap) {
    const arr = item.match(/(?<=('|")).*?(?=(':|":))/g);
    arrClassNameListLib = arrClassNameListLib.concat(arr);
  }
  // console.log('arrClassNameListLib', arrClassNameListLib)
  return arrClassNameListLib;
};

/**
 * 处理CSS文件
 * @param fileRouter
 * @param arrClassNameList
 */
const dealCSSFile = (fileStream: string, arrClassNameList: Array<string>) => {
  fileStream = fileStream.trim();
  for (let item of arrClassNameList) {
    if (!fileStream.includes(`.${item}`)) {
      if (fileStream === "") {
        fileStream += ``;
      } else if (fileStream.endsWith("\n\n")) {
        fileStream += ``;
      } else if (fileStream.endsWith("\n")) {
        fileStream += `\n`;
      } else {
        fileStream += `\n\n`;
      }
      fileStream += `.${item} {\n}`;
    }
  }
  fileStream += `\n`;
  return fileStream;
};

/**
 * 写入类CSS样式文件
 */
export const writeCSSFile = (params: any) => {
  const { arrClassNameList = [], path = "", fileName = "" } = params;
  let isDeal = false;
  const arrExt = ["css", "less", "sass", "scss"];
  // 已有css相关文件
  for (let item of arrExt) {
    const pathCSS = `${path}${fileName}.${item}`;
    if (fs.existsSync(pathCSS)) {
      // 读取文件内容
      let fileRouter = fs.readFileSync(pathCSS);
      // 处理CSS文件
      const strRouterStream = dealCSSFile(
        fileRouter.toString(),
        arrClassNameList
      );
      // 写入文件内容
      fs.writeFileSync(pathCSS, strRouterStream);
      isDeal = true;
    }
  }
  // 无css相关文件，创建css预处理类型文件
  if (!isDeal) {
    const cssType = vscode.workspace
      .getConfiguration()
      .get("code-maker.taro.cssType");
    const pathCSS = `${path}${fileName}.${cssType}`;
    // 空页面保证有对应路径支持
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    // 处理CSS文件
    const strRouterStream = dealCSSFile("", arrClassNameList);
    // 写入文件内容
    fs.writeFileSync(pathCSS, strRouterStream);
  }
};

export default {
  getArrClassNameListNormal,
  arrClassNameListLibWrap,
  writeCSSFile,
};
