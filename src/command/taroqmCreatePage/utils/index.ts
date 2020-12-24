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
  strResult = strResult.replace(/\/\*{1,2}[\s\S]*?\*\//g, "");

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
  // 对子包内的页面排序
  // arrResult.sort((objResultA, objResultB) => {
  //   const strValueA = String(objResultA.value);
  //   const strValueB = String(objResultB.value);
  //   return strValueA.localeCompare(strValueB);
  // });

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
 * 将解析出来的路由对象，改变为字符流
 * @param arrRouter
 */
const transformRouterStream = (arrRouter: Array<any>) => {
  const strHeader = "const sub = [\n";
  const strTail = "]\n\nmodule.exports = sub";
  let result = "";
  result += strHeader;
  for (let item of arrRouter) {
    result += "\t{\n";
    // 解析name
    if (item.name.value) {
      result +=
        `\t\tname: '${item.name.value}',` +
        `${item.name.notes && ` // ${item.name.notes}`}` +
        `\n`;
    }
    // 解析root
    if (item.root.value) {
      result +=
        `\t\troot: '${item.root.value}',` +
        `${item.root.notes && ` // ${item.root.notes}`}` +
        `\n`;
    }
    // 解析pages
    if (item.pages.value.length >= 0) {
      result += `\t\tpages: [\n`;
      for (let itemPageValue of item.pages.value) {
        result +=
          `\t\t\t'${itemPageValue.value}',` +
          `${itemPageValue.notes && ` // ${itemPageValue.notes}`}` +
          `\n`;
      }
      result +=
        `\t\t],` + `${item.pages.notes && ` // ${item.pages.notes}`}` + `\n`;
    }
    result += "\t},\n";
  }
  result += strTail;
  return result;
};

/**
 * 处理路由文件
 * @param path
 */
export const dealRouterFile = (fileRouter: string) => {
  const strRouter = trimRouterFile(fileRouter);
  let arrRouter = strRouter.split("},\n\t{").map((item) => {
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
  console.log("dealRouterFile0", arrRouter);
  // 对路由排序
  // arrRouter.sort((routerA, routerB) => {
  //   const strValueA = String(routerA.root.value);
  //   const strValueB = String(routerB.root.value);
  //   return strValueA.localeCompare(strValueB);
  // });
  const strRouterStream = transformRouterStream(arrRouter);
  console.log("dealRouterFile1", strRouterStream);
  return strRouterStream;
};

export default {
  dealRouterFile,
};
