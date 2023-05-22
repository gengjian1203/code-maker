const fs = require("fs");
const path = require("path");

import createDirectory from "./createDirectory";

/**
 * 拷贝文件
 * @param sourcePath 源位置
 */
const copyFiles = (
  sourcePath: string,
  destinationPath: string,
  operation?: any
) => {
  // 判断源路径是否为文件
  if (fs.statSync(sourcePath).isFile()) {
    // 如果是文件，则执行操作方法并将结果写入目标文件
    let destinationFile;
    if (typeof operation === "function") {
      const sourceFile = fs.readFileSync(sourcePath);
      destinationFile = operation(sourcePath, sourceFile.toString());
    } else {
      destinationFile = fs.readFileSync(sourcePath);
    }
    // 判断目标路径是否存在，如果不存在，则创建对应的目录
    if (!fs.existsSync(destinationPath)) {
      createDirectory(destinationPath);
    }
    fs.writeFileSync(
      path.join(destinationPath, path.basename(sourcePath)),
      destinationFile
    );
  } else {
    // 如果是目录，则遍历目录下的所有文件和子目录，并递归调用copyFiles方法
    const files = fs.readdirSync(sourcePath);
    files.forEach((file: any) => {
      const sourceFilePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationPath, file);
      if (fs.statSync(sourceFilePath).isDirectory()) {
        // 判断目标路径是否存在，如果不存在，则创建对应的目录
        if (!fs.existsSync(destinationFilePath)) {
          createDirectory(destinationFilePath);
        }
        copyFiles(sourceFilePath, destinationFilePath, operation);
      } else {
        // 判断文件是否存在，如果存在，则递归调用copyFiles方法
        if (fs.existsSync(sourceFilePath)) {
          let destinationFile;
          if (typeof operation === "function") {
            const sourceFile = fs.readFileSync(sourceFilePath);
            destinationFile = operation(sourcePath, sourceFile.toString());
          } else {
            destinationFile = fs.readFileSync(sourceFilePath);
          }
          // 判断目标路径是否存在，如果不存在，则创建对应的目录
          if (!fs.existsSync(destinationPath)) {
            createDirectory(destinationPath);
          }
          fs.writeFileSync(destinationFilePath, destinationFile);
        }
      }
    });
  }
};

export default copyFiles;
