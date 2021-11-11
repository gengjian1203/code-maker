import * as vscode from "vscode";

/**
 * 修整路由文件的其他内容
 * @param fileRouter
 */
const trimRouterFile = (fileRouter: string) => {
  let strResult = "";
  const STR_START_1 = "const sub = [";
  const STR_END_1 = "module.exports = sub";
  const nIndexStart1 = fileRouter.indexOf(STR_START_1);
  const nIndexEnd1 = fileRouter.indexOf(STR_END_1);
  if (nIndexStart1 >= 0 && nIndexEnd1 >= 0) {
    const strRouter1 = fileRouter.substring(
      nIndexStart1 + STR_START_1.length,
      nIndexEnd1
    );
    const STR_START_2 = "{";
    const STR_END_2 = "}";
    const nIndexStart2 = strRouter1.indexOf(STR_START_2);
    const nIndexEnd2 = strRouter1.lastIndexOf(STR_END_2);
    if (nIndexStart2 >= 0 && nIndexEnd2 >= 0) {
      const strRouter2 = strRouter1.substring(
        nIndexStart2 + STR_START_2.length,
        nIndexEnd2
      );
      strResult = strRouter2;
    }
  }
  // strResult = strResult.replace(/name:/g, "'name':");
  // strResult = strResult.replace(/root:/g, "'root':");
  // strResult = strResult.replace(/pages:/g, "'pages':");
  // strResult = strResult.replace(/\'/g, '"');

  // 用以兼容win系统 对于读取文件流里的换行，win是'\r\n' mac是'\n'
  strResult = strResult.replace(/\r\n/g, "\n");
  // 两个空格转换为\t
  strResult = strResult.replace(/  /g, "\t");
  // 对于/**/类型的注释，有后面有n个\n，n个\t的字符，直接忽略删除，以免对解析对象有影响
  strResult = strResult.replace(/\/\*{1,2}[\s\S]*?\*\/\n*\t*/g, "");

  console.log("trimRouterFile", strResult);

  return strResult;
};

/**
 * 获取数组型的value
 * @param value
 */
const getArrayValue = (value: string) => {
  const arrValue = value.split(",");
  const arrResult: Array<{ value: string; notes: string }> = [];

  for (let index = 0; index < arrValue.length; index++) {
    const item = arrValue[index];

    const strSign = "//";
    const nIndexSign = item.indexOf(strSign);
    const nIndexReturn = item.indexOf("\n");
    let objResult: { value: string; notes: string } = {
      value: "",
      notes: "",
    };
    // 如果有注释，实际为上一项的注释
    if (nIndexSign >= 0 && nIndexReturn >= 0) {
      const notes = item
        .substring(nIndexSign + strSign.length, nIndexReturn)
        .trim();
      if (index - 1 >= 0) {
        arrResult[index - 1].notes = notes;
      }
      objResult.value = item.substring(nIndexReturn + 1).trim();
    } else {
      objResult.value = item.trim();
    }
    objResult.value = objResult.value.replace(/\'/g, "");
    if (objResult.value) {
      arrResult.push(objResult);
    }
  }

  return arrResult;
};

/**
 * 获取真实的value
 * @param value
 */
const getRealValue = (value: string) => {
  let result: string | Array<any> = value;
  if (value) {
    switch (value[0]) {
      case "'":
        result = value.replace(/\'/g, "");
        break;
      case "[":
        result = value.replace(/[\[|\]]/g, "");
        result = getArrayValue(result);
        break;
      case "{":
        // TODO: 暂时不会有对象类型需要解析
        break;
      default:
        break;
    }
  }
  return result;
};

/**
 * 通过key值获取value
 * @param source 字符段
 * @param key
 */
const getItemValueFromKey = (source: string, key: string) => {
  let value: string | Array<any> = "";
  let notes = "";
  // 根据匹配符获取Value ' => '   [ => ]
  const mapMatch = new Map<string, string>([
    ["'", "'"],
    ["[", "]"],
    ["{", "}"],
  ]);
  const nLengthKey = key.length;
  const nIndexKey = source.indexOf(key);
  if (nIndexKey >= 0) {
    const strEndChar = mapMatch.get(source[nIndexKey + nLengthKey]) || "";
    let nIndexEnd = source.indexOf(strEndChar, nIndexKey + nLengthKey + 1);
    if (nIndexEnd >= 0) {
      nIndexEnd = nIndexEnd + strEndChar.length;
      // 处理Value
      value = source.substring(nIndexKey + nLengthKey, nIndexEnd) || "";
      value = getRealValue(value);
      // 处理Note
      const nIndexReturn = source.indexOf("\n", nIndexEnd);
      if (nIndexReturn >= 0) {
        const strSign = "//";
        let strNote = source.substring(nIndexEnd, nIndexReturn);
        const nIndexSign = strNote.indexOf(strSign);
        if (nIndexSign >= 0) {
          notes = strNote.substring(nIndexSign + strSign.length).trim();
        }
      }
    }
  }
  return {
    value,
    notes,
  };
};

/**
 * 解析出来的路由Name字段，改变为字符流
 * @param name
 */
const transformName = (name: { value: string; notes: string }) => {
  return (
    `\t\t` +
    `name: '${name.value}',` +
    `${name.notes && ` // ${name.notes}`}` +
    `\n`
  );
};

/**
 * 解析出来的路由Root字段，改变为字符流
 * @param root
 */
const transformRoot = (root: { value: string; notes: string }) => {
  return (
    `\t\t` +
    `root: '${root.value}',` +
    `${root.notes && ` // ${root.notes}`}` +
    `\n`
  );
};

/**
 * 解析出来的路由Pages字段，改变为字符流
 * @param value
 */
const transformPages = (pages: {
  value: Array<{ value: string; notes: string }>;
  notes: string;
}) => {
  const printWidth = 80;
  let result = "";
  let isMultiline = false;
  let nValueLength = 12 + 2; // '\t\tpages: ['.length + '],'.length

  nValueLength += pages.value.length >= 1 ? (pages.value.length - 1) * 2 : 0; // ', '.length
  for (let itemPageValue of pages.value) {
    nValueLength += itemPageValue.value.length + 2; // "''".length
    if (itemPageValue.notes) {
      isMultiline = true;
      break;
    }
  }
  if (nValueLength >= 80) {
    isMultiline = true;
  }

  // 字符拼接
  result += `\t\t` + `pages: [` + `${isMultiline ? "\n" : ""}`;
  for (let index = 0; index < pages.value.length; index++) {
    const itemPageValue = pages.value[index];
    result +=
      `${isMultiline ? "\t\t\t" : ""}` +
      `'${itemPageValue.value}'` +
      `${isMultiline || index !== pages.value.length - 1 ? "," : ""}` +
      `${
        (isMultiline && itemPageValue.notes) ||
        (!isMultiline && index !== pages.value.length - 1)
          ? " "
          : ""
      }` +
      `${itemPageValue.notes && `// ${itemPageValue.notes}`}` +
      `${isMultiline ? "\n" : ""}`;
  }
  result +=
    `${isMultiline ? "\t\t" : ""}` +
    `],` +
    `${pages.notes && ` // ${pages.notes}`}` +
    `\n`;

  return result;
};

/**
 * 新增页面路由
 * @param path 文件路径
 * @param pageName 新增页面名称
 * @param pageNotes 新增页面注释
 * @param arrRouter
 */
const addArrRouter = (
  arrRouter: Array<any>,
  path: string,
  pageName: string,
  pageNotes?: string
) => {
  // console.log("addArrRouter0", path, pageName, pageNotes);
  // console.log("addArrRouter1", arrRouter);
  const strSign = "src/pages/";
  const strFullPath = `${path}/${pageName}/index`;
  const nRootStart = strFullPath.indexOf(strSign) + strSign.length;
  const nRootEnd = strFullPath.indexOf("/", nRootStart);
  const strRoot = `pages/${strFullPath.substring(nRootStart, nRootEnd)}`;
  const strPage = strFullPath.substring(nRootEnd + 1);

  // console.log("addArrRouter", strRoot, strPage);
  const nIndex = arrRouter.findIndex((item) => {
    return item.root.value === strRoot;
  });
  if (nIndex >= 0) {
    arrRouter[nIndex].pages.value.push({
      value: strPage,
      notes: pageNotes,
    });
  } else {
    arrRouter.push({
      root: {
        value: strRoot,
        notes: "",
      },
      pages: {
        value: [
          {
            value: strPage,
            notes: pageNotes,
          },
        ],
        notes: "",
      },
    });
  }
};

/**
 * 对路由对象进行字母排序
 * @param arrRouter
 */
const sortArrRouter = (arrRouter: Array<any>) => {
  // 对每个子包内的页面排序
  for (let itemRouter of arrRouter) {
    const arrResult: Array<{ value: string; notes: string }> =
      itemRouter.pages.value;
    arrResult.sort((objResultA, objResultB) => {
      const strValueA = String(objResultA.value);
      const strValueB = String(objResultB.value);
      return strValueA.localeCompare(strValueB);
    });
  }
  // 对子包排序
  arrRouter.sort((routerA, routerB) => {
    const strValueA = String(routerA.root.value);
    const strValueB = String(routerB.root.value);
    return strValueA.localeCompare(strValueB);
  });
};

/**
 * 将解析出来的路由对象，改变为字符流
 * @param arrRouter
 */
const transformRouterStream = (arrRouter: Array<any>) => {
  const strHeader = "const sub = [\n";
  const strTail = "]\n\nmodule.exports = sub\n";
  let result = "";
  result += strHeader;
  for (let item of arrRouter) {
    result += "\t{\n";
    // 解析name
    if (item?.name?.value) {
      result += transformName(item?.name);
    }
    // 解析root
    if (item?.root?.value) {
      result += transformRoot(item?.root);
    }
    // 解析pages
    if (item?.pages?.value?.length >= 0) {
      result += transformPages(item?.pages);
    }
    result += "\t},\n";
  }
  result += strTail;
  return result;
};

/**
 * 处理路由文件
 * @param fileRouter 文件内容
 * @param path 文件路径
 * @param pageName 新增页面名称
 * @param pageNotes 新增页面注释
 */
export const dealRouterFile = (
  fileRouter: string,
  path: string,
  pageName: string,
  pageNotes?: string
) => {
  const strRouter = trimRouterFile(fileRouter);
  let arrRouter = strRouter.split("},\n\t{").map((item) => {
    // console.log("dealRouterFile", item);
    const objNameInfo = getItemValueFromKey(item, "name: ");
    const objRootInfo = getItemValueFromKey(item, "root: ");
    const objPagesInfo = getItemValueFromKey(item, "pages: ");
    return {
      name: {
        value: objNameInfo.value,
        notes: objNameInfo.notes,
      },
      root: {
        value: objRootInfo.value,
        notes: objRootInfo.notes,
      },
      pages: {
        value: objPagesInfo.value,
        notes: objPagesInfo.notes,
      },
    };
  });
  // 新增页面路由
  addArrRouter(arrRouter, path, pageName, pageNotes);
  // 对路由对象进行字母排序
  if (vscode.workspace.getConfiguration().get("code-maker.taro.sortPage")) {
    sortArrRouter(arrRouter);
  }
  // 将路由对象改变为字符流
  const strRouterStream = transformRouterStream(arrRouter);
  // console.log("dealRouterFile0", arrRouter);
  // console.log("dealRouterFile1", strRouterStream);
  return strRouterStream;
};

export default {
  dealRouterFile,
};
