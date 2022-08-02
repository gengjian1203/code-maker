import * as vscode from "vscode";

const objConfiguration = {
  // `Taro`代码助手遵循语法
  "code-maker.taro.grammar": {
    JsClass: "Js+类",
    JsFun: "Js+函数式",
    TsClass: "Ts+类",
    TsFun: "Ts+函数式",
  },
  // `Taro`代码助手CSS命名语法
  "code-maker.taro.cssGrammar": {
    camel: "小驼峰命名法",
    kebab: "短横杠命名法",
  },
  // `Taro`代码助手CSS预处理器
  "code-maker.taro.cssType": {
    less: "less",
    css: "css",
    sass: "sass",
    scss: "scss",
  },
};

/**
 * 获取当前配置信息的介绍
 * @param {string} properties 配置字段名
 */
const getConfigurationName = (properties: string) => {
  let result = "";
  try {
    const key = vscode.workspace.getConfiguration().get(properties);
    result = objConfiguration[properties][key];
  } catch (error) {}

  return result;
};

export default getConfigurationName;
