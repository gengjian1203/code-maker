import * as vscode from "vscode";
import { openFile } from "../../utils";

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.taroqm.EditPage",
    (res) => {
      // The code you place here will be executed every time your command is executed
      openFile({
        path: `${context.extensionPath}/template/TaroQmPage/tsx.tmp`,
      });
    }
  );
};
