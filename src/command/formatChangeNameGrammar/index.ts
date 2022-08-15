import * as vscode from "vscode";
import { arrNameGrammarCase } from "./config";

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.format.ChangeNameGrammar",
    (res) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // 获取当前光标在整个文件的第几个字符
      // const offsetSelect = vscode.window.activeTextEditor?.document.offsetAt(
      //   vscode.window.activeTextEditor?.selection.start
      // );
      // 获取当前光标的行列位置信息
      const pointSelect = vscode.window.activeTextEditor?.selection.start;

      // 获取当前光标的指定字符串起始范围
      const rangeSelect: any =
        vscode.window.activeTextEditor?.document.getWordRangeAtPosition(
          new vscode.Position(
            Number(pointSelect?.line),
            Number(pointSelect?.character)
          ),
          /[a-zA-Z0-9_-]+/g
        );

      // 根据起始范围拿到选中的字符串内容
      const strSelect =
        vscode.window.activeTextEditor?.document.getText(
          new vscode.Range(rangeSelect?.start, rangeSelect?.end)
        ) || "";

      // 根据字符串内容来匹配当前的命名风格类型
      // console.log("format.ChangeNameGrammar!_1", strSelect);
      let nCaseSelect = arrNameGrammarCase.length - 1;

      // 发现匹配的命名风格类型则跳出循环
      for (let i = 0; i < arrNameGrammarCase.length; i++) {
        if (arrNameGrammarCase[i].regExpCheck.test(strSelect)) {
          nCaseSelect = i;
          break;
        }
      }
      const objCaseSelect = arrNameGrammarCase[nCaseSelect];

      // 将选中字符串通过指定的命名类型进行拆分
      const arrSelect = strSelect?.split(objCaseSelect.regExpSplit);
      // console.log("format.ChangeNameGrammar!_2", arrSelect);

      // 每个子项字符串处理成下一个命名风格类型的子项字符串
      const arrSelectNew = arrSelect.map((item, index) => {
        return objCaseSelect.funDealNext(item, index);
      });
      // console.log("format.ChangeNameGrammar!_3", arrSelectNew);

      const strSelectNew = arrSelectNew.join("");

      // console.log("format.ChangeNameGrammar!_4", strSelectNew);

      vscode.window.activeTextEditor?.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(rangeSelect?.start, rangeSelect?.end),
          strSelectNew
        );
      });

      vscode.window.showInformationMessage(`切换至${objCaseSelect.nameNext}`);
    }
  );
};
