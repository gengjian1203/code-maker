import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getProjectRootPath } from "../utils";

// 树节点
export class CustomSidebarItem extends vscode.TreeItem {
  contextValue = "CustomSidebarItem"; // 提供给 when 使用

  // 为每项添加点击事件的命令
  command = {
    title: "openChild",
    command: "coder-maker-tool.openChild",
    arguments: [this.label, path.join(this.parentPath, this.label)],
  };

  constructor(
    public readonly label: string, //存 储当前标签
    public readonly parentPath: string, // 存储当前标签的路径，不包含该标签这个目录
    public readonly filePath: string, // 存储当前标签的完整路径
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  //设置鼠标悬停在此项上时的工具提示文本
  // get tooltip(): string {
  //   return path.join(this.parentPath, this.label)
  // }
}

//树的内容组织管理
export class SidebarTestTree
  implements vscode.TreeDataProvider<CustomSidebarItem>
{
  arrRootPath: Array<Array<string>> = [];

  constructor() {
    // 二维数组
    this.arrRootPath = getProjectRootPath().map((item) => {
      const strSrcPath = `${item}/src`;
      // const arrDir = this.getSubPackageDir(strSrcPath)
      // return arrDir
      return [`${item}/src`];
    });
    // console.log('subpackageTree constructor', this.arrRootPath)
  }

  getSubPackageDir = (strSrcPath: string) => {
    const fsSrcRoot = fs.readdirSync(strSrcPath, "utf-8").map((name) => {
      return path.join(strSrcPath, name);
    });
    const arrList = fsSrcRoot.filter((strFullName) => {
      return fs.statSync(strFullName).isDirectory();
    });
    return arrList;
  };

  onDidChangeTreeData?:
    | vscode.Event<void | CustomSidebarItem | null | undefined>
    | undefined;

  getTreeItem = (
    element: CustomSidebarItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> => {
    return element;
  };

  getChildren = (
    element?: CustomSidebarItem
  ): vscode.ProviderResult<CustomSidebarItem[]> => {
    // 第一层级不展示文件
    const isShowFile = Boolean(element);
    const treeDir: CustomSidebarItem[] = [];
    if (!this.arrRootPath) {
      vscode.window.showInformationMessage("No file in empty directory");
    } else {
      for (let item of this.arrRootPath[0]) {
        if (element === undefined) {
          this.searchFiles(treeDir, item, isShowFile);
        } else {
          this.searchFiles(
            treeDir,
            path.join(element.parentPath, element.label),
            isShowFile
          );
        }
      }
    }
    return treeDir;
  };

  //查找文件，文件夹
  searchFiles = (
    treeDir: CustomSidebarItem[],
    parentPath: string,
    isShowFile: boolean
  ) => {
    if (this.pathExists(parentPath)) {
      let fsReadDir = fs.readdirSync(parentPath, "utf-8");
      fsReadDir.forEach((fileName) => {
        let filePath = path.join(parentPath, fileName); // 用绝对路径
        if (fs.statSync(filePath).isDirectory()) {
          // 目录
          treeDir.push(
            new CustomSidebarItem(
              fileName,
              parentPath,
              filePath,
              vscode.TreeItemCollapsibleState.Collapsed
            )
          );
        } else {
          // 文件
          if (isShowFile) {
            treeDir.push(
              new CustomSidebarItem(
                fileName,
                parentPath,
                filePath,
                vscode.TreeItemCollapsibleState.None
              )
            );
          }
        }
      });
    }
  };

  //判断路径是否存在
  pathExists = (filePath: string): boolean => {
    try {
      fs.accessSync(filePath);
    } catch (err) {
      return false;
    }
    return true;
  };
}
