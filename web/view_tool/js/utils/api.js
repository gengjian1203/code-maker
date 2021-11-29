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
const sendRobot = async () => {
  console.log("sendRobot123");

  const webhook = $("#_qw-robot-webhook").val();
  const strText = $("#_qw-robot-text").val();
  const strImage = $("#_qw-robot-image").val();

  const data = JSON.stringify({
    msgtype: "news",
    news: {
      articles: [
        {
          title: strText,
          url: strImage,
          picurl: strImage,
        },
      ],
    },
  });

  // const data = JSON.stringify({
  //   msgtype: "text",
  //   text: {
  //     content: "hello world",
  //   },
  // });

  // const data = JSON.stringify({
  //   msgtype: "template_card",
  //   template_card: {
  //     card_type: "text_notice",
  //     source: {
  //       icon_url:
  //         "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ft0.qlogo.cn%2Fmbloghead%2Fc85af11d5daed5df825e%2F180&refer=http%3A%2F%2Ft0.qlogo.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638888139&t=823ef7e4dcec12577dbcaeab1be6bbc3",
  //       desc: "我是图标",
  //     },
  //     main_title: {
  //       title: "欢迎使用企业微信",
  //       desc: "您的好友正在邀请您加入企业微信",
  //     },
  //     emphasis_content: {
  //       title: "100",
  //       desc: "数据含义",
  //     },
  //     sub_title_text: "下载企业微信还能抢红包！",
  //     horizontal_content_list: [
  //       {
  //         keyname: "邀请人",
  //         value: "张三",
  //       },
  //       {
  //         keyname: "企微官网",
  //         value: "点击访问",
  //         type: 1,
  //         url: "https://work.weixin.qq.com/?from=openApi",
  //       },
  //       // {
  //       //   keyname: "企微下载",
  //       //   value: "mv0001.mp4",
  //       //   type: 2,
  //       //   media_id:
  //       //     "2TnOrYseY4VwFGVrNqRDv-h4W_P5fLRr-mb5XAdXAv4Xqg5wJBkzBg3EynMkUKf3s",
  //       // },
  //     ],
  //     jump_list: [
  //       {
  //         type: 1,
  //         url: "https://work.weixin.qq.com/?from=openApi",
  //         title: "测试链接",
  //       },
  //       {
  //         type: 2,
  //         appid: "wx821aadcd431646f9",
  //         pagepath: "pages/Loading/index",
  //         title: "跳转小程序",
  //       },
  //     ],
  //     card_action: {
  //       type: 1,
  //       url: "https://prod-5gkxku5cdb510bb2-1259256375.tcloudbaseapp.com/qy_sidebar_tools_h5/index.html?sign=9d534718c4118e4cd8ac1f3b50b08105&t=1636865709",
  //       // appid: "APPID",
  //       // pagepath: "PAGEPATH",
  //     },
  //   },
  // });

  // const data = JSON.stringify({
  //   msgtype: "markdown",
  //   markdown: {
  //     content: `实时新增用户反馈<font color=\"warning\">132例</font>，请相关同事注意。\n
  //        >类型:<font color=\"comment\">用户反馈</font>
  //        >普通用户反馈:<font color=\"comment\">117例</font>
  //        >VIP用户反馈:<font color=\"comment\">15例</font>`,
  //     mentioned_list: ["YunNiang", "@all"],
  //     // mentioned_mobile_list: ["13800001111", "@all"],
  //   },
  // });

  // const data = JSON.stringify({
  //   msgtype: "news",
  //   news: {
  //     articles: [
  //       {
  //         title: "中秋节礼品领取",
  //         description: "今年中秋节公司有豪礼相送",
  //         url: "www.qq.com",
  //         picurl:
  //           "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png",
  //       },
  //     ],
  //   },
  // });

  // const data = JSON.stringify({
  //   msgtype: "file",
  //   file: {
  //     media_id: "YHnanbDrKutQfbpXXN",
  //   },
  // });

  const res = await fetchPOST(webhook, data);
  console.log("1111", res);
  return res;
};
