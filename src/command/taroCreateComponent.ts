import * as vscode from "vscode";
import { copyFile } from "../utils";

const handleCopyFileSuccess = (pathDist: string, index: number) => {
  if (Boolean(index)) {
    return;
  }
  vscode.workspace
    .openTextDocument(pathDist)
    .then(
      (doc) => {
        // 在VSCode编辑窗口展示读取到的文本
        vscode.window.showTextDocument(doc);
      },
      (err) => {
        console.log(`Open ${pathDist} error, ${err}.`);
      }
    )
    .then(undefined, (err) => {
      console.log(`Open ${pathDist} error, ${err}.`);
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

        const fileExts = ["tsx", "less"];
        fileExts.map((item, index) => {
          const param = {
            pathDist: `${path}/${value}/index.${item}`,
            pathSource: `${context.extensionPath}/src/template/TaroComponent.${item}.tmp`,
            fileReg: /TaroComponent/g,
            fileName: value,
          };
          copyFile(param, () => {
            handleCopyFileSuccess(param.pathDist, index);
          });
        });
      });
    }
  );
};
