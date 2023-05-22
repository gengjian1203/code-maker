const fs = require("fs");
const path = require("path");

const arrFirstExtList = [".js", ".ts", ".tsx", ".jsx", ".vue"];
/**
 * 获取指定目录下的第一个文件
 * @param directoryPath 指定目录的绝对路径
 */
const getFirstFilePath = (directoryPath: string) => {
  let targetFilePath = "";

  try {
    const files = fs.readdirSync(directoryPath);

    let targetFile = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = path.extname(file);

      if (arrFirstExtList.includes(extension)) {
        targetFile = file;
        break;
      }

      if (!targetFile) {
        targetFile = file;
      }
    }

    targetFilePath = path.join(directoryPath, targetFile);
  } catch (err) {
    console.log("Unable to scan directory: " + err);
  }

  return targetFilePath;
};

export default getFirstFilePath;
