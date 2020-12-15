import * as vscode from "vscode";
const fs = require("fs");

interface IOpenFileParam {
  path: string; // 文件路径
  success?: (param: IOpenFileParam) => void; // 成功回调
  fail?: (any: any) => void; // 失败回调
}

/**
 * 打开文件
 * @param param 拷贝参数
 * @param success 拷贝文件成功回调
 * @param fail 拷贝文件失败回调
 */
const openFile = (param: IOpenFileParam) => {
  vscode.workspace
    .openTextDocument(param.path)
    .then(
      (doc) => {
        vscode.window.showTextDocument(doc);
        param.success && param.success(param);
      },
      (err) => {
        console.log(`Open ${param.path} error, ${err}.`);
        param.fail && param.fail(param);
      }
    )
    .then(undefined, (err) => {
      console.log(`Open ${param.path} error, ${err}.`);
      param.fail && param.fail(param);
    });
};

export default openFile;
