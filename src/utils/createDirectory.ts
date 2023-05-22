const fs = require("fs");
const path = require("path");

/**
 * 确保指定路径下是路由安全的
 * @param dirPath
 */
const createDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    const parentDir = path.dirname(dirPath);
    createDirectory(parentDir);
    fs.mkdirSync(dirPath);
  }
};

export default createDirectory;
