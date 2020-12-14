const fs = require("fs");

interface ICopyFileParam {
  pathDist: string; // 输出文件路径
  pathSource: string; // 源文件路径
  fileReg: RegExp;
  fileName: string; // 文件名称
}

/**
 * 处理模板文件
 * @param param 处理参数
 * @param template 模板文件字符流
 */
const dealTemplate = (param: ICopyFileParam, template: string) => {
  let fileName = param.fileName.trim();
  if (fileName) {
    // 首字母大写
    fileName = fileName.replace(fileName[0], fileName[0].toUpperCase());
    // -后字母大写
    fileName = fileName.replace(/-[a-z]/g, (L) => L.toUpperCase());
    // 去除-字符
    fileName = fileName.replace(/-/g, "");
  }
  return template.replace(param.fileReg, fileName);
};

/**
 * 拷贝模板文件
 * @param param 拷贝参数
 * @param success 拷贝文件成功回调
 * @param fail 拷贝文件失败回调
 */
const copyFile = (param: ICopyFileParam, success?: any, fail?: any) => {
  // 模板文件是否存在
  if (!fs.existsSync(param.pathSource)) {
    fail && fail({});
    return;
  }

  // 读取文件内容
  let template = fs.readFileSync(param.pathSource, "utf-8");
  console.log("copyFile", template);
  template = dealTemplate(param, template);

  // 保护写入文件时有对应的路径支持
  const pathDistDir = param.pathDist.substr(0, param.pathDist.lastIndexOf("/"));
  if (!fs.existsSync(pathDistDir)) {
    fs.mkdirSync(pathDistDir);
  }

  // 写入文件内容
  fs.writeFileSync(param.pathDist, template);
  success && success({});
};

export default copyFile;
