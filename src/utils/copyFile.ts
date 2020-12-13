const fs = require("fs");

const copyFile = (pathDist: string, pathSource: string, complete?: any) => {
  // 创建文件读如流实例
  var rs = fs.createReadStream(pathSource);
  rs.on("error", (err: any) => {
    if (err) {
      console.log("read error", pathSource, err);
      complete && complete(err);
    }
  });
  // 保护写入文件时有对应的路径支持
  const pathDistDir = pathDist.substr(0, pathDist.lastIndexOf("/"));
  if (!fs.existsSync(pathDistDir)) {
    fs.mkdirSync(pathDistDir);
  }
  // 创建文件写入流实例
  var ws = fs.createWriteStream(pathDist);
  ws.on("error", (err: any) => {
    if (err) {
      console.log("write error", pathDist, err);
      complete && complete(err);
    }
  });
  ws.on("close", (res: any) => {
    complete && complete(res);
  });

  rs.pipe(ws);
};

export default copyFile;
