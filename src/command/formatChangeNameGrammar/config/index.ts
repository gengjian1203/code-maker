export const arrNameGrammarCase = [
  {
    name: "kebab", // 短横线命名法（烤串命名法）
    nameNext: "蛇形命名法",
    regExpCheck: /\-/g,
    regExpSplit: /\-/g,
    funDealNext: (strChild: string, index: number) => {
      // 初始化字符串全部变为小写
      const strChildTmp = strChild?.toLowerCase() || "";
      // 变成蛇形命名法子项
      const result = index !== 0 ? `_${strChildTmp}` : strChildTmp;

      return result;
    },
  },
  {
    name: "snake", // 蛇形命名法
    nameNext: "大驼峰命名法",
    regExpCheck: /\_/g,
    regExpSplit: /\_/g,
    funDealNext: (strChild: string, index: number) => {
      // 初始化字符串全部变为小写
      const strChildTmp = strChild?.toLowerCase() || "";
      // 变成大驼峰命名法子项
      const result = strChildTmp.replace(
        strChildTmp[0],
        strChildTmp[0]?.toUpperCase() || ""
      );

      return result;
    },
  },
  {
    name: "pascal", // 大驼峰命名法（帕斯卡命名法）
    nameNext: "小驼峰命名法",
    regExpCheck: /^[A-Z]/g,
    regExpSplit: /(?=[A-Z])/g,
    funDealNext: (strChild: string, index: number) => {
      // 初始化字符串全部变为小写
      const strChildTmp = strChild?.toLowerCase() || "";
      // 变成小驼峰命名法子项
      const result =
        index !== 0
          ? strChildTmp.replace(
              strChildTmp[0],
              strChildTmp[0]?.toUpperCase() || ""
            )
          : strChildTmp.replace(
              strChildTmp[0],
              strChildTmp[0]?.toLowerCase() || ""
            );
      return result;
    },
  },
  {
    name: "camel", // 小驼峰命名法
    nameNext: "短横线命名法",
    regExpCheck: /[*]/g,
    regExpSplit: /(?=[A-Z])/g,
    funDealNext: (strChild: string, index: number) => {
      // 初始化字符串全部变为小写
      const strChildTmp = strChild?.toLowerCase() || "";
      // 变成短横线命名法子项
      const result = index !== 0 ? `-${strChildTmp}` : strChildTmp;

      return result;
    },
  },
];

export default {
  arrNameGrammarCase,
};
