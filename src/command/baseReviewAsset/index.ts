import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");

interface IFileInfoType {
  filePath: string;
  fileExtension: string;
  fileSize: number;
  fileUse?: boolean; // 该资源被哪个文件使用了
}

// 递归遍历指定路径下的所有文件
const traverseDirectory = (
  directory: string,
  fnProcess: (fileInfo: IFileInfoType, fnBreak: () => void) => void
) => {
  let shouldBreak = false;
  const stack = [directory];

  const fnBreak = () => {
    shouldBreak = true;
  };

  while (stack.length > 0 && !shouldBreak) {
    const currentDir = stack.pop();
    const files = fs.readdirSync(currentDir);

    for (let i = 0; i < files.length && !shouldBreak; i++) {
      const file = files[i];
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        stack.push(filePath);
      } else {
        const fileExtension = path.extname(filePath);
        const fileInfo = {
          filePath: filePath,
          fileExtension: fileExtension,
          fileSize: stats.size,
        };
        fnProcess && fnProcess(fileInfo, fnBreak);
      }
    }
  }
  return;
};

export default (context: vscode.ExtensionContext) => {
  const vscodeConfig = vscode.workspace.getConfiguration();
  const disposable = vscode.commands.registerCommand(
    "code-maker.base.ReviewAsset",
    (res) => {
      // The code you place here will be executed every time your command is executed
      const path = res.fsPath || res.filePath;
      console.log("ReviewAsset", path);

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "检查中...",
          cancellable: true,
        },
        (progress, token) => {
          progress.report({ increment: 0 });
          token.onCancellationRequested(() => {
            // 用户点击取消按钮时触发
            console.log("Progress canceled by user");
            disposable.dispose(); // 停止进度条
          });

          let timeStart = new Date().getTime();
          return new Promise<void>((resolve, reject) => {
            const timer = setInterval(() => {
              const timeProcess = Math.floor(
                (new Date().getTime() - timeStart) / 1000
              );
              progress.report({
                increment: 1,
                message: `检查中...耗时: ${timeProcess}s`,
              });
            }, 1000);

            // 项目中所有资源文件列表
            const assetInfoList: any[] = [];
            // 指定要检验的资源拓展名列表
            const assetExtensions = vscodeConfig.get("code-maker.reviewAsset.assetExtensions");
            const assetExtensionsList = assetExtensions?.toString().split('|') || [];

            if (assetExtensionsList.length > 0) {
              // 遍历指定拓展名文件的资源
              traverseDirectory(path, (assetInfo, fnBreak) => {
                const { filePath, fileExtension, fileSize } = assetInfo;
                if (assetExtensionsList.includes(fileExtension)) {
                  assetInfoList.push(assetInfo);
                }
              });

              // 遍历项目中所有文件, 查找未使用的资源
              traverseDirectory(path, (fileInfo, fnBreak) => {
                // 如果没有未使用的资源, 则停止遍历
                const isAllUsed = assetInfoList.every((item) => {
                  return item?.fileUse;
                });
                if (isAllUsed) {
                  console.log('fnBreakfnBreakfnBreak');
                  fnBreak();
                  return;
                }

                // 以UTF-8编码同步读取文件内容
                const { filePath } = fileInfo;
                const data = fs.readFileSync(filePath, 'utf-8');

                // 查找匹配的URL
                const urlRegex = new RegExp(`(?!\/\/)\/.*.(${assetExtensionsList.join('|')})(?=(?:'|"))`, 'g');
                const matches = data.match(urlRegex); // ['/config/brands.json', '/config/buildInfo.json']

                if (matches && matches.length > 0) {
                  // console.log('matches', filePath, matches);
                  for (let im = 0; im < matches.length; im++) {
                    const matche = matches[im];
                    for (let i = 0; i < assetInfoList.length; i++) {
                      const assetInfo = assetInfoList[i];
                      const { filePath: filePathUnused, fileUse: fileUseUnused } = assetInfo;
                      if (!fileUseUnused && filePathUnused.includes(matche)) {
                        assetInfo.fileUse = filePath;
                        break;
                      }
                    }
                  }
                }
              });
            }

            const assetInfoListUnused = assetInfoList.filter((item) => {
              return !item?.fileUse;
            }).map((item) => {
              return item.filePath;
            });

            const timeProcess = ((new Date().getTime() - timeStart) / 1000).toFixed(2);
            // 打开临时文件
            vscode.workspace
              .openTextDocument({
                content: JSON.stringify({
                  info: {
                    tip1: `匹配资源规则: ${assetExtensionsList.join('|')} `,
                    tip2: `匹配资源文件(assetInfoList): 共 ${assetInfoList.length} 个 `,
                    tip3: `未引用资源文件(assetInfoListUnused): 共 ${assetInfoListUnused.length} 个 `,
                    tip4: `耗时: 共 ${timeProcess} s `,
                    assetInfoListUnused,
                    assetInfoList,
                  }
                }, null, 2)
              })
              .then((document) => {
                vscode.window.showTextDocument(document);
                vscode.window.showInformationMessage(
                  `共找到${assetInfoListUnused.length}个文件, 耗时${timeProcess}s`
                );
              });

            // 写文件
            // fs.writeFileSync(`${path}/assetAll.json`, JSON.stringify(assetInfoList, null, 2));
            // fs.writeFileSync(`${path}/assetUnused.json`, JSON.stringify(assetInfoListUnused, null, 2));

            // // 打开未使用资源文件
            // vscode.workspace.openTextDocument(`${path}/assetAll.json`).then((document) => {
            //   vscode.window.showTextDocument(document);
            // });
            // vscode.workspace.openTextDocument(`${path}/assetUnused.json`).then((document) => {
            //   const timeProcess = ((new Date().getTime() - timeStart) / 1000).toFixed(2);
            //   vscode.window.showTextDocument(document);
            //   vscode.window.showInformationMessage(
            //     `共找到${assetInfoListUnused.length}个文件, 耗时${timeProcess}s`
            //   );
            // });

            clearInterval(timer);
            resolve();
          });
        }
      );
    }
  );

  return;
};
