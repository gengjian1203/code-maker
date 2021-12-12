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

/**
 * 点击机器人发消息按钮
 */
const handleQWRobotBtnClick = async () => {
  try {
    const res = await sendRobot();
    console.log("handleQWRobotBtnClick", res);
  } catch (e) {
    console.log("handleQWRobotBtnClick e", e);
  }
};

// 注册静态元素事件
const regEventFunction = () => {
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
    ],
    // 企微机器人相关
    [
      {
        id: "_qw-robot-btn",
        callback: handleQWRobotBtnClick,
      },
    ]
  );
  console.log("regEventFunction", arrEventClickList);

  arrEventClickList.forEach((item) => {
    $(`#${item.id}`).bind("click", item, item.callback);
  });
};
