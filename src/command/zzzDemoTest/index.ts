import * as vscode from "vscode";

export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand("code-maker.zzz.DemoTest", (res) => {
    // The code you place here will be executed every time your command is executed
    vscode.window.showInformationMessage("zzzDemoTest");
    console.log("zzzDemoTest", res);
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "I am long running!",
        cancellable: true,
      },
      (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("User canceled the long running operation");
        });

        progress.report({ increment: 0 });

        setTimeout(() => {
          progress.report({
            increment: 10,
            message: "I am long running! - still going...",
          });
        }, 1000);

        setTimeout(() => {
          progress.report({
            increment: 40,
            message: "I am long running! - still going even more...",
          });
        }, 2000);

        setTimeout(() => {
          progress.report({
            increment: 50,
            message: "I am long running! - almost there...",
          });
        }, 3000);

        var p = new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 5000);
        });

        return p;
      }
    );
  });
};
