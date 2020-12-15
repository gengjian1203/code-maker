// 创建VSCode插件command脚手架

// const program = require("commander");
const inquirer = require("inquirer");
// const appInfo = require("./package.json");

// program.version(appInfo.version);

process.stdout.write("\033[2J");
process.stdout.write("\033[0f");
process.stdout.write("【VSCode插件脚本工具】\n");
// program
//   .command("do")
//   .description("做点什么呢")
//   .arguments("")
//   // .option("-p, <pathParam>", "路径")
//   .action((option) => {
//     console.log("hello cmd.", option);
//   });

// program.parse(process.argv);

const promptList = [
  {
    type: "input",
    message: "请输入一个新建的命令：",
    name: "name",
    default: "vscodeCommand",
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
    choices: [
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
    ],
  },
];

const confirmList = [
  {
    type: "confirm",
    message: "确认参数，是否开始编译：",
    name: "confirm",
  },
];

inquirer.prompt(promptList).then((result) => {
  console.log(result); // 返回的结果
  inquirer.prompt(confirmList).then((answers) => {
    console.log("confirmList.", result);
    console.log("confirmList.", answers);
  });
});
