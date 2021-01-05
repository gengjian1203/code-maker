import { chmod } from "fs";
import * as vscode from "vscode";

export default (context: any) => {
  return vscode.commands.registerTextEditorCommand(
    "code-maker.format.Import",
    (textEditor, edit, res) => {
      // The code you place here will be executed every time your command is executed
      // console.log("code-maker.format.Import", textEditor, edit, res);

      // const textTmp = textEditor.document.getText()
      // const start = new vscode.Position(0, 0);
      // const end = new vscode.Position(textEditor.document.lineCount + 1, 0);
      // const text = "新替换的内容\nadsdasads\nsdakldksakldsa\n";
      // edit.replace(new vscode.Range(start, end), text);
      // Display a message box to the user
      vscode.window.showInformationMessage("format.Import!");

      // textEditor.document.positionAt(1);

      // new vscode.Location(
      //   vscode.Uri.file(textEditor.document.fileName),
      //   new vscode.Position(0, 1)
      // );
    }
  );
};
