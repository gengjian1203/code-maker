// import FetchManager from "./service/FetchManager.js";

const ak = "HGtCGFPlNXNqAN9PsXPvi71vrDmAAsFp"; // 百度API接口秘钥

let config = {
  isWe: false, // 微信系列
  isWeChat: false, // 普通微信
  isWeCom: false, // 企业微信
};

/**
 * 接口GET请求
 */
const fetchGET = async (url) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "GET",
      async: false, // 设置同步。ajax默认异步
      dataType: "jsonp",
      jsonp: "callback", // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
      jsonpCallback: "callback", // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
      timeout: 20000,
      contentType: "application/json; charset=utf-8",
      success: (res) => {
        resolve(res);
      },
    });
  });
};

/**
 * 接口POST请求
 */
const fetchPOST = async (url, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      data: data,
      type: "POST",
      timeout: 20000,
      success: (res) => {
        resolve(res);
      },
      complete: (res) => {
        console.log("fetchPOST", res);
      },
    });
  });
};

/**
 * 地址编码转经纬度
 */
const geocodingAddress = async (strCity) => {
  // console.log('geocodingAddress', strCity)
  const url =
    `https://api.map.baidu.com/geocoding/v3/` +
    `?output=json` +
    `&ak=${ak}` +
    `&address=${strCity}`;
  const res = await fetchGET(url);
  const location = (res && res.result && res.result.location) || {};
  // console.log('geocoding', location)
  return location;
};

/**
 * 地址逆编码转经纬度
 * coordtype: string bd09ll（百度经纬度坐标）、bd09mc（百度米制坐标）、gcj02ll（国测局经纬度坐标，仅限中国）、wgs84ll（ GPS经纬度）
 */
const reverseGeocodingAddress = async (location) => {
  // console.log('reverseGeocodingAddress', location)
  const url =
    `https://api.map.baidu.com/reverse_geocoding/v3/` +
    `?output=json` +
    `&ak=${ak}` +
    `&coordtype=gcj02ll` +
    `&location=${location.lat},${location.lng}`;
  const res = await fetchGET(url);
  const addressComponent =
    (res && res.result && res.result.addressComponent) || {};
  // console.log('reverse_geocoding', addressComponent)
  return addressComponent;
};

/**
 * 根据城市名字反查省份
 */
const getProvinceFromCity = async (strCity) => {
  const location = await geocodingAddress(strCity);
  const addressComponent = await reverseGeocodingAddress(location);
  return {
    location,
    addressComponent,
  };
};

/**
 * 发送机器人消息
 */
const sendRobot = async () => {
  console.log("sendRobot1");
  const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e90ad37a-12aa-49d4-b028-3f8166b8a076`;
  const data = JSON.stringify({
    msgtype: "text",
    text: {
      content: "hello world",
    },
  });
  const res = await fetchPOST(url, data);
  return res;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// 初始化页面
const initPage = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  $("#_page-user-agent").text(userAgent);
  config = {
    ...config,
    isWe: userAgent.includes("micromessenger"),
    isWeChat:
      userAgent.includes("micromessenger") && !userAgent.includes("wxwork"),
    isWeCom:
      userAgent.includes("micromessenger") && userAgent.includes("wxwork"),
  };
  console.log("initPage", config);
};

/**
 * 点击获取当前时间戳按钮
 */
const handleBtnTimestampClick = () => {
  console.log("_timestamp-btn onclick");
  const date = new Date();
  $("#_timestamp-input-label").val(date.toString());
  $("#_timestamp-input-value").val(date.getTime());
};

/**
 * 点击反查地址按钮
 */
const handleBtnAddressClick = async () => {
  const strCity = $("#_address-input-city").val().trim();
  const res = await getProvinceFromCity(strCity);
  console.log("_address-btn onclick", strCity, res);
  const { location, addressComponent } = res;
  if (location.lat && location.lng) {
    $("#_address-input-ll").val(`lat:${location.lat},lng:${location.lng}`);
  } else {
    $("#_address-input-ll").val(``);
  }
  $("#_address-input-province").val(addressComponent.province);
};

/**
 * 点击反查列表地址按钮
 */
const handleBtnAddressListClick = async () => {
  $("#_address-list-result").empty();
  const strCityList = $("#_address-list-input-city").val().trim();
  const strMarket = $("#_address-list-input-market").val().trim();
  // console.log('_address-list-btn onclick', strCityList)
  let arrCityList = [];
  let arrResList = [];
  let arrProvinceList = [];
  try {
    const strCityListTmp = strCityList
      .replace(/'/g, '"') // 单引号转为双引号
      .replace(/ /g, "") // 去掉无意义空格
      .replace(/,]/g, "]"); // 去掉数组最后一个逗号
    // console.log('arrCityList1', strCityListTmp)
    arrCityList = JSON.parse(strCityListTmp);
    // console.log('arrCityList2', arrCityList)
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
    // console.log('arrCityList Item', item, ' - ', addressComponent.province, ' - ', res)
  }
  arrResList = arrResList.sort((itemA, itemB) => {
    return itemA.province.localeCompare(itemB.province);
  });

  $("#_address-list-result").append(`<li>【${strMarket}-整理】</li>`);
  arrProvinceList = Array.from(
    new Set(
      arrResList.map((item) => {
        return item.province;
      })
    )
  );
  for (let item of arrProvinceList) {
    $("#_address-list-result").append(`<li>${item}</li>`);
  }
  $("#_address-list-result").append(`<li>【${strMarket}-详情】</li>`);
  for (let item of arrResList) {
    $("#_address-list-result").append(
      `<li>${item.city} - ${item.province}</li>`
    );
  }
  console.log("arrResList", strMarket, arrResList);
};

/**
 * 点击机器人发消息按钮
 */
const handleBtnRobotClick = async () => {
  console.log("handleBtnRobotClick");
  const res = await sendRobot();
};

// 注册事件
const regEventFunction = () => {
  // 注册调试
  const vConsole = new VConsole();
  console.log("vConsole", vConsole);

  // 测试按钮点击
  $("#_page-btn-show").bind("click", async () => {
    console.log("_page-btn-show onclick");
    $("#_page-btn-show").text(
      $("#_page-btn-show").text() === "miss" ? "show" : "miss"
    );
  });

  //
  $("#_timestamp-btn").bind("click", handleBtnTimestampClick);
  //
  $("#_address-btn").bind("click", handleBtnAddressClick);
  $("#_address-list-btn").bind("click", handleBtnAddressListClick);
  //
  $("#_robot-btn").bind("click", handleBtnRobotClick);
};

window.onload = () => {
  console.log("hello view Tool1");
  // alert("hello view Tool2");

  initPage();
  regEventFunction();
};
