import * as vscode from "vscode";

export default () => {
  return vscode.commands.registerCommand("code-maker.taroCreatePage", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("taroCreatePage!");
  });
};
