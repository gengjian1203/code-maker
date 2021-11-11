export const arrFileExt = [
  {
    ext: "js",
    process: [
      {
        type: "name",
        reg: /TaroPage/g,
      },
      {
        type: "class",
        reg: /taro-page/g,
      },
    ],
  },
  {
    ext: "ts",
    process: [
      {
        type: "name",
        reg: /TaroPage/g,
      },
      {
        type: "class",
        reg: /taro-page/g,
      },
    ],
  },
  {
    ext: "tsx",
    process: [
      {
        type: "name",
        reg: /TaroPage/g,
      },
      {
        type: "class",
        reg: /taro-page/g,
      },
    ],
  },
  {
    ext: "less",
    process: [
      {
        type: "class",
        reg: /taro-page/g,
      },
    ],
  },
  {
    ext: "config.js",
    process: [],
  },
  {
    ext: "config.ts",
    process: [],
  },
];

export default {
  arrFileExt,
};
