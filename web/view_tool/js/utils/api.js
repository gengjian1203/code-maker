const ak = "HGtCGFPlNXNqAN9PsXPvi71vrDmAAsFp"; // 百度API接口秘钥

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
const sendRobot = async (params) => {
  const { webhook, data } = params || {};
  console.log("sendRobot", webhook, data);
  const res = await fetchPOST(webhook, data);
  return res;
};
