import * as vscode from "vscode";

export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand(
    "code-maker.base.ZZZTest",
    (res) => {
      // The code you place here will be executed every time your command is executed
      console.log("ZZZTest", res);
    }
  );
};
