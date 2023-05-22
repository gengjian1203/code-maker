import * as vscode from "vscode";

/**
 * 获取git实例化对象
 * win：e:ProjectQianMi\enterprise-mini-app\src\pages
 * mac ProjectQianMi/enterprise-mini-app/src/pages
 * @param path 路径
 */
const getBuiltInGitApi = async () => {
  try {
    const extension = vscode.extensions.getExtension("vscode.git");
    if (extension !== undefined) {
      const gitExtension = extension.isActive
        ? extension.exports
        : await extension.activate();

      return gitExtension.getAPI(1);
    }
  } catch {}

  return undefined;
};

export default getBuiltInGitApi;
