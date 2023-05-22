import * as vscode from "vscode";
import {
  copyFiles,
  getFirstFilePath,
  getTemplateList,
  getTemplatePath,
  openFile,
  renameFiles,
  updateTemplateCode,
} from "../../utils";

const fs = require("fs");

/**
 * 拉取模板代码
 */
export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand(
    "code-maker.base.CloneTemplate",
    async (res) => {
      // console.log("CloneTemplate", res);
      const path = res.fsPath || res.filePath;
      const { localREPOPath, localTEMPLATEPath } = getTemplatePath(context);

      // 更新本地模板库代码逻辑：如果有目录就异步更新，否则就同步更新。毕竟不能对着空路径复制代码额
      if (fs.existsSync(localREPOPath)) {
        setTimeout(() => {
          updateTemplateCode(context);
        }, 0);
      } else {
        await updateTemplateCode(context);
      }

      if (fs.existsSync(localREPOPath)) {
        if (fs.existsSync(localTEMPLATEPath)) {
          const list = getTemplateList(localTEMPLATEPath);
          const itemsQuickPick = list.map((item: any) => {
            return {
              ...item,
              label: item.fileName,
              description: item.readmeName,
              detail: item.readmeDetail,
            };
          });
          const optionsQuickPick = {
            placeHolder: "请选择拉取模板的名称: ",
          };

          vscode.window
            .showQuickPick(itemsQuickPick, optionsQuickPick)
            .then((valueQuickPick: any) => {
              // 只有选中合法才执行后续逻辑
              if (valueQuickPick) {
                const { fileName, filePath } = valueQuickPick || {};
                const optionsInput = {
                  placeHolder: "请输入生成的目录名称: ",
                };
                vscode.window.showInputBox(optionsInput).then((valueInput) => {
                  // 只有输入合法才执行后续逻辑
                  if (valueInput) {
                    const descPath = `${path}/${valueInput}`;
                    const regReplace = new RegExp(fileName, "g");
                    // 将模板代码拷贝到对应路径上，同时对其做处理：将模板名称的字符串都替换成输入的目录名称字符串
                    copyFiles(
                      filePath,
                      descPath,
                      (sourcePath: any, sourceFile: any) => {
                        return sourceFile.replace(regReplace, valueInput);
                      }
                    );
                    // 遍历一遍新生成的代码文件名，将模板文件名改为输入的文件名
                    renameFiles(descPath, regReplace, valueInput);
                    // 找到想要打开的文件绝对路由
                    const pathFirstFile = getFirstFilePath(descPath);
                    // 打开刚刚拷贝的文件
                    openFile({
                      path: pathFirstFile,
                    });

                    vscode.window.showInformationMessage("拉取模板代码成功");
                  }
                });
              }
            });
        } else {
          vscode.window.showInformationMessage(
            "本地未找到代码仓库模板路径，请检查模板路径是否正确"
          );
        }
      } else {
        vscode.window.showInformationMessage("本地未找到模板文件，稍后请重试");
      }
    }
  );
};
