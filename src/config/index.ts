const processJTSXCSSTemp = [
  {
    type: "name",
    reg: /TaroComponent/g,
    tail: "",
  },
  {
    type: "name",
    reg: /TaroPage/g,
    tail: "",
  },
  {
    type: "class",
    reg: /taro-component-wrap/g,
    tail: "Wrap",
  },
  {
    type: "class",
    reg: /taro-component-title/g,
    tail: "Title",
  },
  {
    type: "class",
    reg: /taro-component-content/g,
    tail: "Content",
  },
  {
    type: "class",
    reg: /taro-component-value/g,
    tail: "Value",
  },
  {
    type: "class",
    reg: /taro-page-wrap/g,
    tail: "Wrap",
  },
];

export const arrFileExt = [
  {
    ext: "js",
    process: processJTSXCSSTemp,
  },
  {
    ext: "ts",
    process: processJTSXCSSTemp,
  },
  {
    ext: "tsx",
    process: processJTSXCSSTemp,
  },
  {
    ext: "less",
    process: processJTSXCSSTemp,
  },
];

export default {
  arrFileExt,
};
