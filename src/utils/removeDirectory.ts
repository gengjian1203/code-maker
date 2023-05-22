const fs = require("fs");
const path = require("path");

/**
 * 确保指定路径下是路由安全的
 * @param dirPath
 */
const removeDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      removeDirectory(filePath);
      fs.rmdirSync(filePath); // 删除目录
    } else {
      fs.unlinkSync(filePath); // 删除文件
    }
  }
  fs.rmdirSync(dirPath); // 删除当前目录
};

export default removeDirectory;
