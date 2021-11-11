import * as vscode from "vscode";
import * as fs from "fs";
import { openFile } from "../../utils";

/**
 * 打开自定义sidebar目录
 */
export default (context: any) => {
  return vscode.commands.registerCommand(
    "coder-maker-tool.openChild",
    (res, path) => {
      if (!fs.statSync(path).isDirectory()) {
        openFile({
          path: path,
        });
      }
    }
  );
};
