import * as vscode from "vscode";
import { arrFileExt } from "../../config";
import { copyFile, openFile } from "../../utils";

/**
 * 处理模板文件的回调：修改组件名称、类名
 * @param template 模板字符串
 * @param fileName 文件名
 * @param fileExt 文件拓展类型
 */
const dealTemplate = (template: string, fileName: string, fileExt: any) => {
  let result = template;
  let strName = fileName.trim();
  if (strName) {
    const cssGrammar = String(
      vscode.workspace.getConfiguration().get("code-maker.taro.cssGrammar")
    );
    fileExt.process.map((item: any) => {
      let name = `${strName}${item.tail}`;
      switch (item.type) {
        case "name": {
          // 首字母大写
          name = name.replace(name[0], name[0].toUpperCase());
          // -后字母大写
          name = name.replace(/-[a-z]/g, (letter) => letter.toUpperCase());
          // 去除-字符
          name = name.replace(/-/g, "");
          break;
        }
        case "class": {
          if (cssGrammar === "kebab") {
            // 短横杠命名法
            // 大写字母前面加-
            name = name.replace(/[A-Z]/g, (letter) => "-" + letter);
            // 如果首字符是-，则去掉
            name = name.startsWith("-") ? name.replace("-", "") : name;
            // 全部转小写
            name = name.toLowerCase();
          } else if (cssGrammar === "camel") {
            // 小驼峰命名法
            // 首字母小写
            name = name.replace(name[0], name[0].toLowerCase());
            // -后字母大写
            name = name.replace(/-[a-z]/g, (letter) => letter.toUpperCase());
            // 去除-字符
            name = name.replace(/-/g, "");
          } else {
            // 无匹配不作处理
          }
          break;
        }
        default: {
          // 其他规则（-连接命名法）
          // // 大写字母前面加-
          // name = name.replace(/[A-Z]/g, (letter) => '-' + letter)
          // // 如果首字符是-，则去掉
          // name = name.startsWith('-') ? name.replace('-', '') : name
          // // 全部转小写
          // name = name.toLowerCase()

          // 其他规则（大驼峰命名法）
          // // 首字母大写
          // name = name.replace(name[0], name[0].toUpperCase());
          // // -后字母大写
          // name = name.replace(/-[a-z]/g, (letter) => letter.toUpperCase());
          // // 去除-字符
          // name = name.replace(/-/g, "");

          // 其他规则（小驼峰命名法）
          // // 首字母小写
          // name = name.replace(name[0], name[0].toLowerCase());
          // // -后字母大写
          // name = name.replace(/-[a-z]/g, (letter) => letter.toUpperCase());
          // // 去除-字符
          // name = name.replace(/-/g, "");
          break;
        }
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
  if (
    !(
      pathDist.endsWith(".ts") ||
      pathDist.endsWith(".tsx") ||
      pathDist.endsWith(".js")
    )
  ) {
    return;
  }
  openFile({
    path: pathDist,
  });
};

/**
 * 创建Taro组件模板
 */
export default (context: any) => {
  return vscode.commands.registerCommand(
    "code-maker.taro.CreateComponent",
    (res) => {
      console.log("CreateComponent", res);
      const path = res.fsPath || res.filePath;
      const grammar = vscode.workspace
        .getConfiguration()
        .get("code-maker.taro.grammar");
      const options = {
        prompt: "请输入新建Taro组件的名称: ",
        placeHolder: "组件名(如：HelloWorld)",
      };

      vscode.window.showInputBox(options).then((value) => {
        if (!value) {
          return;
        }
        arrFileExt.map((item, index) => {
          copyFile({
            pathDist: `${path}/${value}/index.${item.ext}`,
            pathSource: `${context.extensionPath}/template/TaroComponent/${grammar}/${item.ext}.tmp`,
            dealTemplate: (template: string) => {
              return dealTemplate(template, value, item);
            },
            success: (param) => {
              copyFileSuccess(param.pathDist, index);
            },
          });
        });
      });
    }
  );
};
