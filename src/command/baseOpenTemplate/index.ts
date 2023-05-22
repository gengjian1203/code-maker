import * as vscode from "vscode";
import { getTemplatePath } from "../../utils";

export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand(
    "code-maker.base.OpenTemplate",
    (res) => {
      // The code you place here will be executed every time your command is executed
      const { localTEMPLATEPath } = getTemplatePath(context);

      const uri = vscode.Uri.file(localTEMPLATEPath);
      vscode.commands.executeCommand("vscode.openFolder", uri, true);
    }
  );
};
