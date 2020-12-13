import * as vscode from "vscode";

export default (context: any) => {
  return vscode.commands.registerCommand("code-maker.taroCreatePage", (res) => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("taroCreatePage!");
    vscode.window
      .showQuickPick(
        [
          "111111111111111111111",
          "2222222222222222222",
          "33333333333333333333",
          "4444444444444444",
        ],
        {
          canPickMany: true,
          ignoreFocusOut: true,
          matchOnDescription: true,
          matchOnDetail: true,
          placeHolder: "00000000000000000000000",
        }
      )
      .then(function (msg) {
        console.log(msg);
      });
  });
};
