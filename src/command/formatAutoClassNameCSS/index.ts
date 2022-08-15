import * as vscode from "vscode";
import {
  dealFileInfo,
  getArrClassNameListNormal,
  arrClassNameListLibWrap,
  writeCSSFile,
} from "./utils";

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.format.AutoClassNameCSS",
    (res) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // console.log('format.AutoClassNameCSS!', res.path)

      // 解析文件路由相关信息
      const fileInfo = dealFileInfo(res.path);
      if (!fileInfo) {
        return;
      }
      const { path = "", file = "", fileName = "", fileExt = "" } = fileInfo;
      console.log("dealFileInfo", path, file, fileName, fileExt);

      // 获取编译器文本内容、解析对应className
      const content = vscode.window.activeTextEditor?.document.getText() || "";
      const arrClassNameListNormal = getArrClassNameListNormal(content);
      const arrClassNameListLib = arrClassNameListLibWrap(content);
      const arrClassNameList = [
        ...new Set([...arrClassNameListNormal, ...arrClassNameListLib]),
      ];
      console.log("arrClassNameList", arrClassNameList);

      // 将className写入类CSS样式文件
      writeCSSFile({
        arrClassNameList,
        path,
        fileName,
      });
      vscode.window.showInformationMessage("更新完毕");
    }
  );
};
