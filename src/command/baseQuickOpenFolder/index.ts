import * as vscode from "vscode";

export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand(
    "code-maker.base.QuickOpenFolder",
    (res) => {
      // The code you place here will be executed every time your command is executed
      console.log("QuickOpenFolder", res);
      const path = res.fsPath || res.filePath;
      const uri = vscode.Uri.file(path);
      vscode.commands.executeCommand("vscode.openFolder", uri, true);
    }
  );
};
