import * as vscode from "vscode";
import { copyFile } from "../utils";

const handleCopyFileComplete = (pathTarget: string) => {
  vscode.workspace
    .openTextDocument(pathTarget)
    .then(
      (doc) => {
        // 在VSCode编辑窗口展示读取到的文本
        vscode.window.showTextDocument(doc);
      },
      (err) => {
        console.log(`Open ${pathTarget} error, ${err}.`);
      }
    )
    .then(undefined, (err) => {
      console.log(`Open ${pathTarget} error, ${err}.`);
    });
};

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.taroCreateComponent",
    (res) => {
      const path = res.fsPath;
      const options = {
        prompt: "请输入组件名: ",
        placeHolder: "组件名",
      };

      vscode.window.showInputBox(options).then((value) => {
        console.log("taroCreateComponent", value);
        if (!value) {
          return;
        }

        const fileExts = ["less", "tsx"];
        for (let item of fileExts) {
          const pathTarget: string = `${path}/${value}/index.${item}`;
          const pathTemplate: string = `${context.extensionPath}/src/template/TaroComponent.${item}.tmp`;
          copyFile(
            pathTarget,
            pathTemplate,
            handleCopyFileComplete(pathTarget)
          );
        }
      });
    }
  );
};
