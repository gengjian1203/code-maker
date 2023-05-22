const fs = require("fs");
const path = require("path");

/**
 * 修改指定目录下所有符合要求的文件的名字
 * @param dirPath 指定目录的绝对路径
 * @param pattern 用来匹配符合要求的文件名的正则表达式
 * @param replacement 用来替换的字符串
 */
const renameFiles = (
  dirPath: string,
  pattern: string | RegExp,
  replacement: string
) => {
  const regex = new RegExp(pattern);
  fs.readdirSync(dirPath).forEach((file: any) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      renameFiles(filePath, pattern, replacement);
    } else if (stat.isFile() && regex.test(file)) {
      const newFileName = file.replace(regex, replacement);
      fs.renameSync(filePath, path.join(dirPath, newFileName));
    }
  });
};

export default renameFiles;
