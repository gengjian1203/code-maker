import * as vscode from "vscode";
import { getWebViewContent } from "../../utils";

/**
 * 常用工具页面
 */
export default (context: any) => {
  return vscode.commands.registerCommand("code-maker.view.Tool", (res) => {
    // vscode.window.showInformationMessage("view Tool!");
    const panel = vscode.window.createWebviewPanel(
      "viewTool", // viewType
      "常用工具页面", // 视图标题
      vscode.ViewColumn.One, // 显示在编辑器的哪个部位
      {
        enableScripts: true, // 启用JS，默认禁用
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      }
    );
    const pathTemplateFile = "./template/ViewTool/index.html";
    panel.webview.html = getWebViewContent(context, pathTemplateFile);
  });
};
