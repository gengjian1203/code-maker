export const arrFileExt = [
  {
    ext: "js",
    process: [
      {
        type: "name",
        reg: /TaroComponent/g,
      },
      {
        type: "class",
        reg: /taro-component/g,
      },
    ],
  },
  {
    ext: "ts",
    process: [
      {
        type: "name",
        reg: /TaroComponent/g,
      },
      {
        type: "class",
        reg: /taro-component/g,
      },
    ],
  },
  {
    ext: "tsx",
    process: [
      {
        type: "name",
        reg: /TaroComponent/g,
      },
      {
        type: "class",
        reg: /taro-component/g,
      },
    ],
  },
  {
    ext: "less",
    process: [
      {
        type: "class",
        reg: /taro-component/g,
      },
    ],
  },
];

export default {
  arrFileExt,
};
