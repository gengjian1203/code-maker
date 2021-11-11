import * as vscode from "vscode";
import {
  queryIconfontResponse,
  spliceIconfontData,
  getIconfontTemplate,
  writeIconfontFile,
} from "./utils/index";

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.taro.UpdateIconfont",
    (res) => {
      const path = res.fsPath;
      if (!(path.indexOf("enterprise-mini-app") >= 0)) {
        vscode.window.showInformationMessage(
          "更新Taro Iconfont引用样式暂不支持其他项目"
        );
      } else {
        const options = {
          prompt: "请输入Iconfont的Url: ",
          placeHolder: "如：//at.alicdn.com/t/font_1439371_9im63e0wohb.css",
        };

        vscode.window.showInputBox(options).then(async (value) => {
          if (!value) {
            return;
          }
          // 网络获取iconfont
          // https://at.alicdn.com/t/font_1728270_48bs1ez64h2.css
          const strIconfontUrl = `https:${value}`;
          const strIconfontData = await queryIconfontResponse(strIconfontUrl);
          // 获取拆分的两部分
          const objIconfontData = spliceIconfontData(strIconfontData);
          // 获取模板部分
          const strIconfontTemp = getIconfontTemplate(
            `${context.extensionPath}/template/TaroIconfont/less.tmp`
          );
          // 写入Icon的less文件
          const nIndex = path.indexOf("enterprise-mini-app");
          if (nIndex >= 0) {
            const strPathHeader = path.substring(0, nIndex);
            const strIconfontParh = `${strPathHeader}/enterprise-mini-app/src/pages/auth/ui-base/icon/index.less`;
            writeIconfontFile(
              strIconfontParh,
              objIconfontData,
              strIconfontTemp
            );
          }
        });
      }
    }
  );
};
