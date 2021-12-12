/**
 * 展示对应页面
 * @param {*} idPage
 */
const showPageContent = (idPage = arrConfigNavList[0].idPage) => {
  arrConfigNavList.forEach((item, index) => {
    if (item.idPage === idPage) {
      $(`#${item.id}`).addClass("active");
      // $(`#${item.idPage}`).addClass("in active fade");
      $(`#${item.idPage}`).show();
    } else {
      $(`#${item.id}`).removeClass("active");
      // $(`#${item.idPage}`).removeClass("in active");
      $(`#${item.idPage}`).hide();
    }
  });
};

/**
 * HTML转义
 * @param {*} html
 * @returns
 */
const encodeHTML = (html) => {
  let temp = document.createElement("div");
  temp.textContent !== null
    ? (temp.textContent = html)
    : (temp.innerText = html);
  const output = temp.innerHTML;
  temp = null;
  return output;
};

/**
 * 清除代码无意义的换行
 */
const formatCodeContent = (strCode) => {
  const result = strCode
    .replace(/\n          /g, "\n") // 去掉过多缩进
    .replace(/        \n$/g, ""); // 去掉末尾多于换行
  // console.log("formatCodeContent", result);
  return encodeHTML(result);
};

/**
 * 复制内容到剪贴板
 */
const setClipboardData = (strText) => {
  const oInput = document.createElement("textarea");
  oInput.value = strText;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  const resCommandCopy = document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.className = "oInput";
  oInput.style.display = "none";
  oInput.blur();
  if (resCommandCopy) {
    console.log("复制成功");
    return true;
  } else {
    console.error("复制失败");
    return false;
  }
};

/**
 * 弹出提示信息
 * @param {*} strTip
 * @param {*} strType
 * @param {*} duration
 */
const showTip = (strTip = "", strType = "success", duration = 1000) => {
  const idTip = `#_global-tip-${strType}`;
  const idTipText = `#_global-tip-${strType}-text`;
  $(idTipText).html(strTip);
  $(idTip).show();
  setTimeout(() => {
    $(idTip).hide();
  }, duration);
};

/**
 * 提取表单内input组件的信息
 */

// 获取指定form中的所有的<input>对象
const getInputElements = (formId) => {
  const form = document.getElementById(formId);
  const elements = new Array();
  const tagElements = form.getElementsByTagName("input");
  for (let j = 0; j < tagElements.length; j++) {
    elements.push(tagElements[j]);
  }
  return elements;
};

// 获取单个input中的【name,value】数组
const inputSelector = (element) => {
  console.log(
    "inputSelector",
    element,
    element.checked,
    element.name,
    element.value
  );
  if (element.checked) {
    return [element.name, element.value];
  }
};

//
const getInputValue = (element) => {
  switch (element.type.toLowerCase()) {
    case "submit":
    case "hidden":
    case "password":
    case "text":
      return [element.name, element.value];
    case "checkbox":
    case "radio":
      return inputSelector(element);
  }
  return false;
};

// 组合URL
const serializeElement = (element) => {
  const method = element.tagName.toLowerCase();
  const parameter = getInputValue(element);

  if (parameter) {
    const key = encodeURIComponent(parameter[0]);
    const value = encodeURIComponent(parameter[1]);
    if (key.length === 0 || value.length === 0) {
      return;
    }

    if (parameter[1].constructor !== Array) {
      parameter[1] = [parameter[1]];
    }

    const values = parameter[1];
    const results = [];
    for (let i = 0; i < values.length; i++) {
      results.push(key + "=" + encodeURIComponent(values[i]));
    }
    return results.join("&");
  }
};

// 调用方法
const serializeForm = (formId) => {
  const elements = getInputElements(formId);
  const result = new Array();

  for (let i = 0; i < elements.length; i++) {
    let queryComponent = serializeElement(elements[i]);
    if (queryComponent) {
      result.push(queryComponent);
    }
  }

  return `?${result.join("&")}`;
};

/**
 * 企微机器人发送消息，切换指定类型的可发送字段
 */
const showQWRobotMsgtype = (idMsgtype) => {
  const arrQWRobotItemList = [
    { id: "_qw-robot-item-content" },
    { id: "_qw-robot-item-base64" },
    { id: "_qw-robot-item-md5" },
    { id: "_qw-robot-item-title" },
    { id: "_qw-robot-item-description" },
    { id: "_qw-robot-item-url" },
    { id: "_qw-robot-item-picurl" },
    { id: "_qw-robot-item-media_id" },
    { id: "_qw-robot-item-card_type" },
    { id: "_qw-robot-item-image" },
  ];

  const arrQWRobotInputList = [
    { id: "_qw-robot-content", value: "测试文本" },
    {
      id: "_qw-robot-base64",
      // 注意不能携带图片头部 data:image/png;base64,
      value:
        `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`.replaceAll(
          "\r|\n",
          ""
        ),
    },
    { id: "_qw-robot-md5", value: "3745643b9024787e14d83da896653a29" },
    { id: "_qw-robot-title", value: "中秋节礼品领取" },
    { id: "_qw-robot-description", value: "今年中秋节公司有豪礼相送" },
    { id: "_qw-robot-url", value: "www.qq.com" },
    {
      id: "_qw-robot-picurl",
      value:
        "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png",
    },
    {
      id: "_qw-robot-media_id",
      value: "3a8asd892asd8asd",
    },
    {
      id: "_qw-robot-image",
      value:
        "https://up.enterdesk.com/edpic/ec/ca/d8/eccad87a334d082b8ff200ae01157e44.jpg",
    },
  ];

  arrQWRobotItemList.forEach((item) => {
    $(`#${item.id}`).addClass("display-none");
  });
  arrQWRobotInputList.forEach((item) => {
    $(`#${item.id}`).data("info", item);
    $(`#${item.id}`).val("");
  });

  $("#_qw-robot-radio-card_type-text_notice").removeAttr("checked");
  $("#_qw-robot-radio-card_type-news_notice").removeAttr("checked");

  switch (idMsgtype) {
    case "_qw-robot-radio-msgtype-text": {
      $(`#_qw-robot-item-content`).removeClass("display-none");
      $(`#_qw-robot-content`).val($(`#_qw-robot-content`).data("info").value);
      break;
    }
    case "_qw-robot-radio-msgtype-image": {
      $(`#_qw-robot-item-base64`).removeClass("display-none");
      $(`#_qw-robot-item-md5`).removeClass("display-none");
      $(`#_qw-robot-base64`).val($(`#_qw-robot-base64`).data("info").value);
      $(`#_qw-robot-md5`).val($(`#_qw-robot-md5`).data("info").value);
      break;
    }
    case "_qw-robot-radio-msgtype-news": {
      $(`#_qw-robot-item-title`).removeClass("display-none");
      $(`#_qw-robot-item-description`).removeClass("display-none");
      $(`#_qw-robot-item-url`).removeClass("display-none");
      $(`#_qw-robot-item-picurl`).removeClass("display-none");
      $(`#_qw-robot-title`).val($(`#_qw-robot-title`).data("info").value);
      $(`#_qw-robot-description`).val(
        $(`#_qw-robot-description`).data("info").value
      );
      $(`#_qw-robot-url`).val($(`#_qw-robot-url`).data("info").value);
      $(`#_qw-robot-picurl`).val($(`#_qw-robot-picurl`).data("info").value);
      break;
    }
    case "_qw-robot-radio-msgtype-file": {
      $(`#_qw-robot-item-media_id`).removeClass("display-none");
      $(`#_qw-robot-media_id`).val($(`#_qw-robot-media_id`).data("info").value);
      break;
    }
    case "_qw-robot-radio-msgtype-template_card": {
      $(`#_qw-robot-item-card_type`).removeClass("display-none");
      $("#_qw-robot-radio-card_type-text_notice").attr("checked", "checked");
      // $("#_qw-robot-radio-card_type-news_notice").attr("checked", true);
      break;
    }
    default: {
      break;
    }
  }
};
