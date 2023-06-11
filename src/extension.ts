// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import commands from "./command";

// 初始化插件
const initExtension = async (context: vscode.ExtensionContext) => {
  // 当打开编辑器触发事件
  const handleDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(
    (doc) => {
      //
      // console.log("onDidChangeActiveTextEditor", doc);
      // const config = vscode.workspace.getConfiguration();
      // console.log("onDidChangeActiveTextEditor", config);
    }
  );

  context.subscriptions.push(handleDidOpenTextDocument);

  console.log("initExtension done.");
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-maker" is now active!');
  // vscode.window.showInformationMessage("Hello World from code-maker!");

  // init
  initExtension(context);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // 注册命令
  for (let key in commands) {
    context.subscriptions.push(commands[key](context));
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
