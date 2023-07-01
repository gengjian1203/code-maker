import * as vscode from "vscode";
import createDirectory from "./createDirectory";
import getTemplatePath from "./getTemplatePath";
import GitManager from "../utilsManager/GitManager";

const fs = require("fs");

/**
 * 更新本地的模板代码
 */
const updateTemplateCode = async (context: vscode.ExtensionContext) => {
  const {
    extensionPath,
    gitTemplateUrl,
    gitTemplatePath,
    repoName,
    tplName,
    localTPLPath,
    localREPOPath,
  } = getTemplatePath(context);

  // 如果没有模板目录则创建一个
  try {
    createDirectory(localTPLPath);
  } catch (e) {
    vscode.window.showInformationMessage(
      `模板仓库目录创建失败${JSON.stringify(e)}`
    );
  }

  // 判断是否存在模板，如果存在就pull，如果不存在就clone
  if (fs.existsSync(localREPOPath)) {
    const optionsGitPull = {
      path: localTPLPath,
    };
    const resGitPull = await GitManager.pull(optionsGitPull);
    const { res, msg } = resGitPull;
    if (res) {
      vscode.window.showInformationMessage(`模板仓库克隆成功`);
    } else {
      vscode.window.showErrorMessage(msg);
    }
  } else {
    const optionsGitClone = {
      path: localTPLPath,
      url: gitTemplateUrl,
    };
    const resGitClone = await GitManager.clone(optionsGitClone);
    const { res, msg } = resGitClone;
    if (res) {
      vscode.window.showInformationMessage(`模板仓库克隆成功`);
    } else {
      vscode.window.showErrorMessage(msg);
    }
  }
};

export default updateTemplateCode;
