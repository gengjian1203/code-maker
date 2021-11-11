import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * 获取当前所在工程根目录
 * @param {*} document
 */
const getProjectRootPath = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders || [];
  const workspaceFoldersPath = workspaceFolders.map((item) => item.uri.path);
  // 由于存在Multi-root工作区，暂时没有特别好的判断方法，先这样粗暴判断
  return workspaceFoldersPath;
};

export default getProjectRootPath;
