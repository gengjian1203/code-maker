import * as vscode from "vscode";
import { copyFile } from "../utils";

const arrFileExt = [
  {
    ext: "tsx",
    process: [
      {
        type: "name",
        reg: /TaroQmComponent/g,
      },
      {
        type: "class",
        reg: /taro-qm-component/g,
      },
    ],
  },
  {
    ext: "less",
    process: [
      {
        type: "class",
        reg: /taro-qm-component/g,
      },
    ],
  },
];

/**
 * 处理模板文件的回调：修改组件名称、类名
 * @param template 模板字符串
 * @param fileName 文件名
 * @param fileExt 文件拓展类型
 */
const handleDealTemplate = (
  template: string,
  fileName: string,
  fileExt: any
) => {
  let result = template;
  // console.log("handleDealTemplate", template, fileExt);
  let name = fileName.trim();
  if (name) {
    fileExt.process.map((item: any) => {
      switch (item.type) {
        case "name":
          // 首字母大写
          name = name.replace(name[0], name[0].toUpperCase());
          // -后字母大写
          name = name.replace(/-[a-z]/g, (letter) => letter.toUpperCase());
          // 去除-字符
          name = name.replace(/-/g, "");
          break;
        case "class":
          // 大写字母前面加-
          name = name.replace(/[A-Z]/g, (letter) => "-" + letter);
          // 如果首字符是-，则去掉
          name = name.startsWith("-") ? name.replace("-", "") : name;
          // 全部转小写
          name = name.toLowerCase();
          break;
        default:
          break;
      }
      // console.log("handleDealTemplate", item, name);
      result = result.replace(item.reg, name);
    });
  }
  return result;
};

/**
 * 文件复制成功后回调：编译器中打开对应文件
 * @param pathDist
 * @param index
 */
const handleCopyFileSuccess = (pathDist: string, index: number) => {
  if (Boolean(index)) {
    return;
  }
  vscode.workspace
    .openTextDocument(pathDist)
    .then(
      (doc) => {
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
    "code-maker.taroqmCreateComponent",
    (res) => {
      const path = res.fsPath;
      const options = {
        prompt: "请输入新建Taro(QM)组件的名称: ",
        placeHolder: "组件名",
      };

      vscode.window.showInputBox(options).then((value) => {
        if (!value) {
          return;
        }
        arrFileExt.map((item, index) => {
          copyFile({
            pathDist: `${path}/${value}/index.${item.ext}`,
            pathSource: `${context.extensionPath}/src/template/TaroQmComponent/${item.ext}.tmp`,
            dealTemplate: (template: string) => {
              return handleDealTemplate(template, value, item);
            },
            success: (param) => {
              handleCopyFileSuccess(param.pathDist, index);
            },
          });
        });
      });
    }
  );
};
