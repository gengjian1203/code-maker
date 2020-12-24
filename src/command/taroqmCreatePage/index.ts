import * as vscode from "vscode";
import { copyFile, openFile } from "../../utils";
import { dealRouterFile } from "./utils";

const fs = require("fs");

const arrFileExt = [
  {
    ext: "tsx",
    process: [
      {
        type: "name",
        reg: /TaroQmPage/g,
      },
      {
        type: "class",
        reg: /taro-qm-page/g,
      },
    ],
  },
  {
    ext: "less",
    process: [
      {
        type: "class",
        reg: /taro-qm-page/g,
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
const dealTemplate = (template: string, fileName: string, fileExt: any) => {
  let result = template;
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
const copyFileSuccess = (pathDist: string, index: number) => {
  if (Boolean(index)) {
    return;
  }
  openFile({
    path: pathDist,
  });
};

/**
 * 注册router
 * @param path 供参考的路径
 */
const registerRouter = (path: string) => {
  // const pathRouter = `${path}`;
  const nIndex = path.indexOf("src/pages");
  if (nIndex >= 0) {
    const pathRouter =
      `${path.substring(0, nIndex)}` + `builder/default/router/sub.js`;
    // router文件是否存在
    if (fs.existsSync(pathRouter)) {
      // 读取文件内容
      let fileRouter = fs.readFileSync(pathRouter);
      // 处理路由文本
      const strRouterStream = dealRouterFile(fileRouter.toString());
      // 写入文件内容
      fs.writeFileSync(pathRouter, strRouterStream);
    }
  }
};

export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.taroqm.CreatePage",
    (res) => {
      const path = res.fsPath;
      const options = {
        prompt: "请输入新建Taro(QM)页面的名称: ",
        placeHolder: "页面名",
      };

      vscode.window.showInputBox(options).then((value) => {
        if (!value) {
          return;
        }
        // 拷贝模板文件
        arrFileExt.map((item, index) => {
          copyFile({
            pathDist: `${path}/${value}/index.${item.ext}`,
            pathSource: `${context.extensionPath}/template/TaroQmPage/${item.ext}.tmp`,
            dealTemplate: (template: string) => {
              return dealTemplate(template, value, item);
            },
            success: (param) => {
              copyFileSuccess(param.pathDist, index);
            },
          });
        });
        // // 注册router
        registerRouter(path);
      });
    }
  );
};
