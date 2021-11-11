import * as vscode from "vscode";
import { openFile } from "../../utils";

/**
 * 编辑Taro页面模板
 */
export default (context: any) => {
  return vscode.commands.registerCommand("code-maker.taro.EditPage", (res) => {
    // The code you place here will be executed every time your command is executed
    const grammar = String(
      vscode.workspace.getConfiguration().get("code-maker.taro.grammar")
    );
    const fileName = grammar.includes("Ts") ? "ts" : "js";
    openFile({
      path: `${context.extensionPath}/template/TaroPage/${grammar}/${fileName}.tmp`,
    });
  });
};
