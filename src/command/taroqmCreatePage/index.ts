import * as vscode from "vscode";
import { copyFile, formatPath, openFile } from "../../utils";
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
  {
    ext: "config.ts",
    process: [],
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
 * @param pageName 页面名称
 * @param pageNotes 页面注释
 */
const registerRouter = (path: string, pageName: string, pageNotes?: string) => {
  const pathReal = formatPath(path);
  const nIndex = pathReal.indexOf("src/pages");
  if (nIndex >= 0) {
    const pathRouter = formatPath(
      `${pathReal.substring(0, nIndex)}` + `builder/default/router/sub.js`
    );
    // router文件是否存在
    if (fs.existsSync(pathRouter)) {
      // 读取文件内容
      let fileRouter = fs.readFileSync(pathRouter);
      // 处理路由文本
      const strRouterStream = dealRouterFile(
        fileRouter.toString(),
        pathReal,
        pageName,
        pageNotes
      );
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
        prompt: "请输入新建Taro(QM)页面的:页面名称|页面注释",
        placeHolder: "page-test|这是一个测试页面",
      };

      vscode.window.showInputBox(options).then((value) => {
        const arrValue = String(value).split("|");
        const pageName = arrValue && arrValue[0] ? arrValue && arrValue[0] : "";
        const pageNotes =
          arrValue && arrValue[1] ? arrValue && arrValue[1] : "";
        if (!value || !arrValue || !pageName) {
          vscode.window.showInformationMessage("新建页面的名称不能为空");
          return;
        }

        const pathDir = `${path}/${pageName}`;

        // 拷贝模板文件
        arrFileExt.map((item, index) => {
          copyFile({
            pathDist: `${pathDir}/index.${item.ext}`,
            pathSource: `${context.extensionPath}/template/TaroQmPage/${item.ext}.tmp`,
            dealTemplate: (template: string) => {
              return dealTemplate(template, pageName, item);
            },
            success: (param) => {
              copyFileSuccess(param.pathDist, index);
            },
          });
        });
        // 创建组件目录
        fs.mkdirSync(`${pathDir}/components/`);

        // 注册router
        registerRouter(path, pageName, pageNotes);
      });
    }
  );
};
