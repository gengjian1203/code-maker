import * as vscode from "vscode";

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.vsCreateComponent",
    (res) => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("vsCreateComponent!");
    }
  );
};
