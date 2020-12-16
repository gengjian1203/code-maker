// const program = require("commander");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

const packageInfo = require("./package.json");

const pathPackage = path.resolve(__dirname, "package.json");
const pathTemplate = path.resolve(
  __dirname,
  "template",
  "VSCodeCommand",
  "ts.tmp"
);
const pathCommandIndex = path.resolve(__dirname, "src", "command", "index.ts");

const arrMenusList = [
  {
    name: "资源管理器上下文菜单",
    code: "explorer/context",
  },
  {
    name: "编辑器上下文菜单",
    code: "editor/context",
  },
  {
    name: "编辑标题菜单栏",
    code: "editor/title",
  },
  {
    name: "编辑器标题上下文菜单",
    code: "editor/title/context",
  },
];

const promptList = [
  {
    type: "input",
    message: "请输入一个新建的命令：",
    name: "name",
    default: "vscode.Command",
  },
  {
    type: "input",
    message: "请输入一个新建命令的名称：",
    name: "title",
    default: "VSCode插件命令",
  },
  {
    type: "checkbox",
    message: "在以下位置是否绑定对应菜单的交互？",
    name: "menus",
    choices: arrMenusList.map((item) => {
      return { name: item.name };
    }),
  },
];

const confirmList = [
  {
    type: "confirm",
    message: "确认参数，是否开始创建：",
    name: "confirm",
  },
];

/**
 * 插入事件
 * @param {*} param
 */
const insertPackageEvents = (param) => {
  packageInfo.activationEvents.push(`onCommand:code-maker.${param.name}`);
  packageInfo.activationEvents.sort((nameA, nameB) => {
    return nameA > nameB;
  });
};

/**
 * 插入命令
 * @param {*} param
 */
const insertPackageCommands = (param) => {
  packageInfo.contributes.commands.push({
    command: `onCommand:code-maker.${param.name}`,
    title: param.title,
  });
  packageInfo.contributes.commands.sort((commandA, commandB) => {
    return commandA.command > commandB.command;
  });
};

/**
 * 插入菜单
 * @param {*} param
 */
const insertPackageMenus = (param) => {
  for (let menu of param.menus) {
    const nIndex = arrMenusList.findIndex((item) => {
      item.name === menu;
    });
    if (nIndex >= 0) {
      packageInfo.menus[arrMenusList[nIndex].code].push({
        command: `onCommand:code-maker.${param.name}`,
        group: "navigation",
        when: "true",
      });
      packageInfo.menus[arrMenusList[nIndex].code].sort((menuA, menuB) => {
        return menuA.command > menuB.command;
      });
    }
  }
};

/**
 * 插入注册文件
 * @param {*} param
 */
const insertPackage = (param) => {
  if (packageInfo) {
    insertPackageEvents(param);
    insertPackageCommands(param);
    insertPackageMenus(param);
    console.log("insertPackage", packageInfo);
    // 写入文件内容
    fs.writeFileSync(pathPackage, JSON.stringify(packageInfo, null, 2));
  }
};

/**
 * 插入索引命令
 * @param {*}} param
 */
const insertCommandIndex = (param) => {
  if (packageInfo) {
  }
};

/**
 * 拷贝模板
 * @param {*} param
 */
const copyTemplate = (param) => {
  const name = param.name.replace(/\./g, "");
  const pathDist = path.resolve(__dirname, "src", "command", `${name}.ts`);
  console.log("copyTemplate", param.name, name, pathDist);

  // 模板文件是否存在
  if (!fs.existsSync(pathTemplate)) {
    return;
  }

  // 读取文件内容
  let template = fs.readFileSync(pathTemplate, "utf-8");
  template = template.replace(/vscode.Command/g, param.name);

  // 保护写入文件时有对应的路径支持
  const pathDistDir = pathDist.substr(0, pathDist.lastIndexOf("/"));
  if (!fs.existsSync(pathDistDir)) {
    fs.mkdirSync(pathDistDir);
  }

  // 写入文件内容
  fs.writeFileSync(pathDist, template);
};

/**
 * 创建命令
 * @param
 */
const createCommand = (param) => {
  // console.log("createCommand1", param);
  // console.log("createCommand2", packageInfo);
  insertPackage(param);
  insertCommandIndex(param);
  copyTemplate(param);
};

/**
 * 程序入口
 */
process.stdout.write("\033[2J");
process.stdout.write("\033[0f");
process.stdout.write(`【VSCode插件脚本工具】${packageInfo.version}\n`);
//
inquirer.prompt(promptList).then((result) => {
  console.log(result); // 返回的结果
  inquirer.prompt(confirmList).then((answers) => {
    if (answers.confirm) {
      createCommand(result);
    }
  });
});
