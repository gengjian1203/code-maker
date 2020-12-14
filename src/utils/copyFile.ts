const fs = require("fs");

interface ICopyFileParam {
  pathDist: string; // 输出文件路径
  pathSource: string; // 源文件路径
  dealTemplate?: (template: string) => string; // 处理模板数据回调
  success?: (param: ICopyFileParam) => void; // 成功回调
  fail?: () => void; // 失败回调
}

/**
 * 拷贝模板文件
 * @param param 拷贝参数
 * @param success 拷贝文件成功回调
 * @param fail 拷贝文件失败回调
 */
const copyFile = (param: ICopyFileParam) => {
  // 模板文件是否存在
  if (!fs.existsSync(param.pathSource)) {
    param.fail && param.fail();
    return;
  }

  // 读取文件内容
  let template = fs.readFileSync(param.pathSource, "utf-8");
  // console.log("copyFile", template);
  template = param.dealTemplate && param.dealTemplate(template);

  // 保护写入文件时有对应的路径支持
  const pathDistDir = param.pathDist.substr(0, param.pathDist.lastIndexOf("/"));
  if (!fs.existsSync(pathDistDir)) {
    fs.mkdirSync(pathDistDir);
  }

  // 写入文件内容
  fs.writeFileSync(param.pathDist, template);
  param.success && param.success(param);
};

export default copyFile;
