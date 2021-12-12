/**
 * 点击导航
 * @param {*} params
 */
const handleNavItemClick = (e) => {
  const params = e.data;
  console.log("handleNavItemClick", e, params);
  showPageContent(params.idPage);
};

/**
 * 点击获取当前时间戳按钮
 */
const handleTimestampBtnClick = () => {
  console.log("_timestamp-btn onclick");
  const timestamp = parseInt($("#_timestamp-input").val());
  if (timestamp) {
    const date = new Date(timestamp);
    $("#_timestamp-time").html(date.toString());
    $("#_timestamp-simpletime").html(getStringDate(date).timeString);
  } else {
    const date = new Date();
    $("#_timestamp-time").html(date.toString());
    $("#_timestamp-simpletime").html(getStringDate(date).timeString);
    $("#_timestamp-input").val(date.getTime());
  }
};

/**
 * 点击单一地址查询按钮
 */
const handleCityOneBtnClick = async () => {
  const strCity = $("#_city-one-input").val().trim();
  if (strCity) {
    const res = await getProvinceFromCity(strCity);
    console.log("_city-one-input onclick", strCity, res);
    const { location, addressComponent } = res;
    if (location.lat && location.lng) {
      $("#_city-one-ll").html(`lat:${location.lat}, lng:${location.lng}`);
    } else {
      $("#_city-one-ll").html(``);
    }
    $("#_city-one-province").html(addressComponent.province);
  }
};

/**
 * 点击多个地址查询按钮
 */
const handleCityMultiBtnClick = async () => {
  $("#_city-multi-result").empty();
  const strCityList = $("#_city-multi-input").val().trim();
  // console.log('_address-list-btn onclick', strCityList)
  let arrCityList = [];
  let arrResList = [];
  let arrProvinceList = [];
  try {
    const strCityListTmp = strCityList
      .replace(/'/g, '"') // 单引号转为双引号
      .replace(/ /g, "") // 去掉无意义空格
      .replace(/,]/g, "]"); // 去掉数组最后一个逗号
    console.log("arrCityList1", strCityListTmp);
    arrCityList = JSON.parse(strCityListTmp);
    console.log("arrCityList2", arrCityList);
  } catch (e) {
    console.log("反查列表地址非法");
  }
  for (let item of arrCityList) {
    const res = await getProvinceFromCity(item);
    const { location, addressComponent } = res;
    arrResList.push({
      city: item,
      province: addressComponent.province,
    });
    console.log(
      "arrCityList Item",
      item,
      " - ",
      addressComponent.province,
      " - ",
      res
    );
  }
  arrResList = arrResList.sort((itemA, itemB) => {
    return itemA.province.localeCompare(itemB.province);
  });

  $("#_city-multi-result").append(`<li>【整理】</li>`);
  arrProvinceList = Array.from(
    new Set(
      arrResList.map((item) => {
        return item.province;
      })
    )
  );
  for (let item of arrProvinceList) {
    $("#_city-multi-result").append(`<li>${item}</li>`);
  }
  $("#_city-multi-result").append(`<li>【详情】</li>`);
  for (let item of arrResList) {
    $("#_city-multi-result").append(`<li>${item.city} - ${item.province}</li>`);
  }
  console.log("arrResList", arrResList);
};

// 点击代码复制
const handleCodeCopyClick = async (item) => {
  const { data = "" } = item || {};
  console.log("handleCodeCopyClick", data);
  setClipboardData(data.code);
  showTip("复制成功");
};

// 企微机器人切换msgtype的radio
const handleQWRobotRadioMsgtypeChange = async (e) => {
  console.log("handleQWRobotRadioMsgtypeChange", e);
  const { id = "" } = (e && e.data) || {};
  showQWRobotMsgtype(id);
};

/**
 * 点击机器人发消息按钮
 */
const handleQWRobotSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const resForm = router2Params(serializeForm("_qw-robot-form"));
  console.log("handleQWRobotSubmit", resForm);
  const {
    params: {
      webhook = "",
      msgtype = "",
      content = "",
      base64 = "",
      md5 = "",
      title = "",
      description = "",
      url = "",
      picurl = "",
      media_id = "",
      card_type = "",
    },
  } = resForm;

  console.log(
    "handleQWRobotSubmit",
    `${msgtype}-${card_type}`,
    " - ",
    webhook,
    msgtype,
    content,
    base64,
    md5,
    title,
    description,
    url,
    picurl,
    media_id
  );

  if (!webhook || !msgtype) {
    showTip("参数缺失", "danger");
    return false;
  }

  let params = null;

  switch (msgtype) {
    case "text": {
      params = {
        webhook,
        data: JSON.stringify({
          msgtype: msgtype,
          text: {
            content: content,
          },
        }),
      };
      break;
    }
    case "image": {
      params = {
        webhook,
        data: JSON.stringify({
          msgtype: msgtype,
          image: {
            base64: base64,
            md5: md5,
          },
        }),
      };
      break;
    }
    case "news": {
      params = {
        webhook,
        data: JSON.stringify({
          msgtype: msgtype,
          news: {
            articles: [
              {
                title: title,
                description: description,
                url: url,
                picurl: picurl,
              },
            ],
          },
        }),
      };
      break;
    }
    case "file": {
      params = {
        webhook,
        data: JSON.stringify({
          msgtype: msgtype,
          file: {
            media_id: media_id,
          },
        }),
      };
      break;
    }
    case "template_card": {
      if (card_type === "text_notice") {
        params = {
          webhook,
          data: JSON.stringify({
            msgtype: msgtype,
            template_card: {
              card_type: card_type,
              source: {
                icon_url:
                  "https://wework.qpic.cn/wwpic/252813_jOfDHtcISzuodLa_1629280209/0",
                desc: "企业微信",
                desc_color: 0,
              },
              main_title: {
                title: "欢迎使用企业微信",
                desc: "您的好友正在邀请您加入企业微信",
              },
              emphasis_content: {
                title: "100",
                desc: "数据含义",
              },
              quote_area: {
                type: 1,
                url: "https://work.weixin.qq.com/?from=openApi",
                appid: "APPID",
                pagepath: "PAGEPATH",
                title: "引用文本标题",
                quote_text:
                  "Jack：企业微信真的很好用~\nBalian：超级好的一款软件！",
              },
              sub_title_text: "下载企业微信还能抢红包！",
              horizontal_content_list: [
                {
                  keyname: "邀请人",
                  value: "张三",
                },
                {
                  keyname: "企微官网",
                  value: "点击访问",
                  type: 1,
                  url: "https://work.weixin.qq.com/?from=openApi",
                },
              ],
              jump_list: [
                {
                  type: 1,
                  url: "https://work.weixin.qq.com/?from=openApi",
                  title: "企业微信官网",
                },
                // {
                //   type: 2,
                //   appid: "APPID",
                //   pagepath: "PAGEPATH",
                //   title: "跳转小程序",
                // },
              ],
              card_action: {
                type: 1,
                url: "https://work.weixin.qq.com/?from=openApi",
                appid: "APPID",
                pagepath: "PAGEPATH",
              },
            },
          }),
        };
      } else if (card_type === "news_notice") {
        params = {
          webhook,
          data: JSON.stringify({
            msgtype: msgtype,
            template_card: {
              card_type: card_type,
              source: {
                icon_url:
                  "https://wework.qpic.cn/wwpic/252813_jOfDHtcISzuodLa_1629280209/0",
                desc: "企业微信",
                desc_color: 0,
              },
              main_title: {
                title: "欢迎使用企业微信",
                desc: "您的好友正在邀请您加入企业微信",
              },
              card_image: {
                url: "https://wework.qpic.cn/wwpic/354393_4zpkKXd7SrGMvfg_1629280616/0",
                aspect_ratio: 2.25,
              },
              image_text_area: {
                type: 1,
                url: "https://work.weixin.qq.com",
                title: "欢迎使用企业微信",
                desc: "您的好友正在邀请您加入企业微信",
                image_url:
                  "https://wework.qpic.cn/wwpic/354393_4zpkKXd7SrGMvfg_1629280616/0",
              },
              quote_area: {
                type: 1,
                url: "https://work.weixin.qq.com/?from=openApi",
                appid: "APPID",
                pagepath: "PAGEPATH",
                title: "引用文本标题",
                quote_text:
                  "Jack：企业微信真的很好用~\nBalian：超级好的一款软件！",
              },
              vertical_content_list: [
                {
                  title: "惊喜红包等你来拿",
                  desc: "下载企业微信还能抢红包！",
                },
              ],
              horizontal_content_list: [
                {
                  keyname: "邀请人",
                  value: "张三",
                },
                {
                  keyname: "企微官网",
                  value: "点击访问",
                  type: 1,
                  url: "https://work.weixin.qq.com/?from=openApi",
                },
                // {
                //   keyname: "企微下载",
                //   value: "企业微信.apk",
                //   type: 2,
                //   media_id: "MEDIAID",
                // },
              ],
              jump_list: [
                {
                  type: 1,
                  url: "https://work.weixin.qq.com/?from=openApi",
                  title: "企业微信官网",
                },
                // {
                //   type: 2,
                //   appid: "APPID",
                //   pagepath: "PAGEPATH",
                //   title: "跳转小程序",
                // },
              ],
              card_action: {
                type: 1,
                url: "https://work.weixin.qq.com/?from=openApi",
                appid: "APPID",
                pagepath: "PAGEPATH",
              },
            },
          }),
        };
      }
      break;
    }
    default: {
      break;
    }
  }

  try {
    if (params) {
      showTip("发送消息");
      const res = await sendRobot(params);
    } else {
      showTip("参数非法", "danger");
    }
    console.log("handleQWRobotSubmit", res);
  } catch (err) {
    console.log("handleQWRobotSubmit e", err);
  }
};

// 注册静态元素事件
const regEventFunction = () => {
  // 点击事件
  const arrEventClickList = [].concat(
    // 时间相关
    [
      {
        id: "_timestamp-btn",
        callback: handleTimestampBtnClick,
      },
    ],
    // 地址相关
    [
      {
        id: "_city-one-btn",
        callback: handleCityOneBtnClick,
      },
      {
        id: "_city-multi-btn",
        callback: handleCityMultiBtnClick,
      },
    ]
  );

  // 改变事件
  const arrEventChangeList = [].concat(
    //
    [
      {
        id: "_qw-robot-radio-msgtype-text",
        callback: handleQWRobotRadioMsgtypeChange,
      },
      {
        id: "_qw-robot-radio-msgtype-image",
        callback: handleQWRobotRadioMsgtypeChange,
      },
      {
        id: "_qw-robot-radio-msgtype-news",
        callback: handleQWRobotRadioMsgtypeChange,
      },
      {
        id: "_qw-robot-radio-msgtype-file",
        callback: handleQWRobotRadioMsgtypeChange,
      },
      {
        id: "_qw-robot-radio-msgtype-template_card",
        callback: handleQWRobotRadioMsgtypeChange,
      },
    ]
  );

  // 提交事件
  const arrEventSubmitList = [].concat(
    // 企微机器人相关
    [
      {
        id: "_qw-robot-form",
        callback: handleQWRobotSubmit,
      },
    ]
  );

  console.log(
    "regEventFunction",
    arrEventClickList,
    arrEventSubmitList,
    arrEventChangeList
  );
  arrEventClickList.forEach((item) => {
    $(`#${item.id}`).bind("click", item, item.callback);
  });
  arrEventChangeList.forEach((item) => {
    $(`#${item.id}`).bind("change", item, item.callback);
  });
  arrEventSubmitList.forEach((item) => {
    $(`#${item.id}`).bind("submit", item, item.callback);
  });
};
