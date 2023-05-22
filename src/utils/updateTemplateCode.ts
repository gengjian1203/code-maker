import * as vscode from "vscode";
import { execSync } from "child_process";
import createDirectory from "./createDirectory";
import getTemplatePath from "./getTemplatePath";

const fs = require("fs");
const path = require("path");

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
    try {
      const cmdGitPull = `git pull`;
      const resGitPull = execSync(cmdGitPull, {
        stdio: "pipe", //
        encoding: "utf-8",
        cwd: localREPOPath,
      });
      vscode.window.showInformationMessage(`模板仓库更新成功`);
    } catch (e) {
      const strE = JSON.stringify(e);
      if (strE.includes("Abort")) {
        const cmdGitPullForce = `git reset --hard origin/$(git rev-parse --abbrev-ref HEAD) && git pull origin $(git rev-parse --abbrev-ref HEAD) --force`;
        try {
          const resGitPullForce = execSync(cmdGitPullForce, {
            stdio: "pipe", //
            encoding: "utf-8",
            cwd: localREPOPath,
          });
          vscode.window.showInformationMessage(`模板仓库强制更新成功`);
        } catch (eForce) {
          vscode.window.showInformationMessage(
            `模板仓库强制更新失败${JSON.stringify(e)}`
          );
        }
      } else {
        vscode.window.showInformationMessage(
          `模板仓库更新失败${JSON.stringify(e)}`
        );
      }

      // git pull origin <branch-name> --force
    }
  } else {
    try {
      const cmdGitClone = `git clone ${gitTemplateUrl}`;
      const resGitClone = execSync(cmdGitClone, {
        stdio: "pipe", //
        encoding: "utf-8",
        cwd: localTPLPath,
      });
      vscode.window.showInformationMessage(`模板仓库克隆成功`);
    } catch (e) {
      vscode.window.showInformationMessage(
        `模板仓库克隆失败${JSON.stringify(e)}`
      );
    }
  }
};

export default updateTemplateCode;
