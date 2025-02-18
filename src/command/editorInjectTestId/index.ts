import * as vscode from "vscode";
import { parseDocument } from "htmlparser2";
import { DomHandler, Element } from "domhandler";

const fs = require("fs");

export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand(
    "code-maker.editor.InjectTestId",
    (res) => {
      // The code you place here will be executed every time your command is executed
      vscode.window.showInformationMessage("editorInjectTestId");
      console.log("editorInjectTestId", res);

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const document = editor.document;
      if (document.languageId !== "html") {
        vscode.window.showErrorMessage("The active file is not an HTML file.");
        return;
      }

      const htmlContent = document.getText();
      const dom = parseDocument(htmlContent);

      const addDataTestId = (element: Element) => {
        if (element.tagName === "div") {
          element.attribs["data-testid"] = `div-${
            element.attribs["name"] || "default"
          }`;
        }
        if (element.children) {
          element.children.forEach((child) => {
            if (child instanceof Element) {
              addDataTestId(child);
            }
          });
        }
      };

      dom.children.forEach((child: any) => {
        if (child instanceof Element) {
          addDataTestId(child);
        }
      });

      const updatedHtml = dom.toString();
      fs.writeFileSync(document.uri.fsPath, updatedHtml, "utf8");
      vscode.window.showInformationMessage(
        "Added data-testid to div elements."
      );
    }
  );
};
