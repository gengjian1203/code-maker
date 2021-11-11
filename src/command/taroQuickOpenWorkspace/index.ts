import * as vscode from "vscode";

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.taro.QuickOpenWorkspace",
    (res) => {
      // The code you place here will be executed every time your command is executed
      console.log("QuickOpenWorkspace", res);
      const path = res.fsPath || res.filePath;
      const uri = vscode.Uri.file(path);
      vscode.commands.executeCommand("vscode.openFolder", uri, true);
    }
  );
};
