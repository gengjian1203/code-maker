const fs = require("fs");

interface ICopyFileParam {
  pathDist: string; // 输出文件路径
  pathSource: string; // 源文件路径
  fileReg: RegExp;
  fileName: string; // 文件名称
}

const copyFile = (param: ICopyFileParam, complete?: any) => {
  // 模板文件是否存在
  if (!fs.existsSync(param.pathSource)) {
    complete && complete({});
    return;
  }

  // 读取文件内容
  let template = fs.readFileSync(param.pathSource, "utf-8");
  // console.log("copyFile", template);
  template = template.replace(param.fileReg, param.fileName);

  // 保护写入文件时有对应的路径支持
  const pathDistDir = param.pathDist.substr(0, param.pathDist.lastIndexOf("/"));
  if (!fs.existsSync(pathDistDir)) {
    fs.mkdirSync(pathDistDir);
  }

  // 写入文件内容
  fs.writeFileSync(param.pathDist, template);
};

export default copyFile;
