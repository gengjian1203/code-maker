/**
 * 格式化路径 统一windows/mac系统下的路径格式
 * win：e:ProjectQianMi\enterprise-mini-app\src\pages
 * mac ProjectQianMi/enterprise-mini-app/src/pages
 * @param path 路径
 */
const formatPath = (path: string) => {
  return path.replace(/\\/g, "/");
};

export default formatPath;
