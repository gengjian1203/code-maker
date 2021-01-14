import * as vscode from "vscode";
import { getWebViewContent } from "../../utils";

export default (context: any) => {
  return vscode.commands.registerCommand("code-maker.view.Fetch", (res) => {
    vscode.window.showInformationMessage("view.Fetch!");
    const panel = vscode.window.createWebviewPanel(
      "viewFetch", // viewType
      "模拟接口请求", // 视图标题
      vscode.ViewColumn.One, // 显示在编辑器的哪个部位
      {
        enableScripts: true, // 启用JS，默认禁用
        retainContextWhenHidden: false, // webview被隐藏时保持状态，避免被重置
      }
    );
    const pathTemplateFile = "./template/ViewFetch/index.html";
    panel.webview.html = getWebViewContent(context, pathTemplateFile);
  });
};
