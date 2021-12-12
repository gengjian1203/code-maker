const arrPageCssList = [
  {
    isPreview: true,
    content: [
      {
        title: "多栏自适应文字省略布局样式",
        lang: "html",
        code: `
          <div class="module-wrap">
            <div class="module-left">1111</div>
            <div class="module-mid-1">
              <div class="mid-text text-ellipsis">abcabcabcabcabcabcabcabcabc</div>
            </div>
            <div class="module-mid-2">
              <div class="mid-text textarea-ellipsis">汉皇重色思倾国，御宇多年求不得。杨家有女初长成，养在深闺人未识。天生丽质难自弃，一朝选在君王侧。回眸一笑百媚生，六宫粉黛无颜色。春寒赐浴华清池，温泉水滑洗凝脂。侍儿扶起娇无力，始是新承恩泽时。云鬓花颜金步摇，芙蓉帐暖度春宵。春宵苦短日高起，从此君王不早朝。承欢侍宴无闲暇，春从春游夜专夜。后宫佳丽三千人，三千宠爱在一身。金屋妆成娇侍夜，玉楼宴罢醉和春。姊妹弟兄皆列土，可怜光彩生门户。遂令天下父母心，不重生男重生女。骊宫高处入青云，仙乐风飘处处闻。缓歌慢舞凝丝竹，尽日君王看不足。渔阳鼙鼓动地来，惊破霓裳羽衣曲。九重城阙烟尘生，千乘万骑西南行。翠华摇摇行复止，西出都门百余里。六军不发无奈何，宛转蛾眉马前死。花钿委地无人收，翠翘金雀玉搔头。君王掩面救不得，回看血泪相和流。黄埃散漫风萧索，云栈萦纡登剑阁。峨嵋山下少人行，旌旗无光日色薄。蜀江水碧蜀山青，圣主朝朝暮暮情。行宫见月伤心色，夜雨闻铃肠断声。天旋地转回龙驭，到此踌躇不能去。马嵬坡下泥土中，不见玉颜空死处。君臣相顾尽沾衣，东望都门信马归。归来池苑皆依旧，太液芙蓉未央柳。芙蓉如面柳如眉，对此如何不泪垂。春风桃李花开夜，秋雨梧桐叶落时。西宫南苑多秋草，落叶满阶红不扫。梨园弟子白发新，椒房阿监青娥老。夕殿萤飞思悄然，孤灯挑尽未成眠。迟迟钟鼓初长夜，耿耿星河欲曙天。鸳鸯瓦冷霜华重，翡翠衾寒谁与共。悠悠生死别经年，魂魄不曾来入梦。临邛道士鸿都客，能以精诚致魂魄。为感君王辗转思，遂教方士殷勤觅。排空驭气奔如电，升天入地求之遍。上穷碧落下黄泉，两处茫茫皆不见。忽闻海上有仙山，山在虚无缥渺间。楼阁玲珑五云起，其中绰约多仙子。中有一人字太真，雪肤花貌参差是。金阙西厢叩玉扃，转教小玉报双成。闻道汉家天子使，九华帐里梦魂惊。揽衣推枕起徘徊，珠箔银屏迤逦开。云鬓半偏新睡觉，花冠不整下堂来。风吹仙袂飘飖举，犹似霓裳羽衣舞。玉容寂寞泪阑干，梨花一枝春带雨。含情凝睇谢君王，一别音容两渺茫。昭阳殿里恩爱绝，蓬莱宫中日月长。回头下望人寰处，不见长安见尘雾。惟将旧物表深情，钿合金钗寄将去。钗留一股合一扇，钗擘黄金合分钿。但令心似金钿坚，天上人间会相见。临别殷勤重寄词，词中有誓两心知。七月七日长生殿，夜半无人私语时。在天愿作比翼鸟，在地愿为连理枝。天长地久有时尽，此恨绵绵无绝期。</div>
            </div>
            <div class="module-right">2222</div>
          </div>
        `,
      },
      {
        title: "",
        lang: "css",
        code: `
          <style>
            .module-wrap {
              width: 100%;
              display: flex;
              flex-direction: row;
            }

            .module-left {
              height: 100%;
              flex: 0 0 120px;
              background-color: red;
            }

            .module-mid-1 {
              flex: 1 1 auto;
              width: 0; /* 此处的宽度为关键 */
              height: 100%;
              background-color: yellow;
            }

            .module-mid-2 {
              flex: 1 1 auto;
              width: 0; /* 此处的宽度为关键 */
              height: 100%;
              background-color: peachpuff;
            }
            
            .module-right {
              height: 100%;
              flex: 0 0 120px;
              background-color: green;
            }
            
            .text-ellipsis {
              display: block;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .textarea-ellipsis {
              display: -webkit-box; /* 对象作为弹性伸缩盒子模型显示 */
              width: 100%;
              overflow: hidden;
              -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
              -webkit-line-clamp: 3; /* 展示行数 */
              /* 如果多行文本内有可能存在长单词英文，那么需要对长单词英文进行打断 */
              word-wrap: break-word; /* 是否允许在单词内进行断句 */
              word-break: break-all; /* 可以在任何位置断句 */
              /* 让多行文字两端对齐 */
              text-align: justify; /* 多行文本样式最好加上：文本两端对齐 */
            }
          </style>
        `,
      },
    ],
  },
  {
    isPreview: true,
    content: [
      {
        title: "骨架屏样式",
        lang: "html",
        code: `
          <div class="iconSkeleton"></div>
        `,
      },
      {
        title: "",
        lang: "css",
        code: `
          <style>
            .iconSkeleton {
              width: 100px;
              height: 100px;
              border-radius: 12px;
              background-color: #e0e0e0;
              animation: skeleton-blink 1.2s ease-in-out infinite;
            }
            
            @keyframes skeleton-blink {
              50% {
                opacity: 0.6;
              }
            }
          </style>
        `,
      },
    ],
  },
  {
    isPreview: true,
    content: [
      {
        title: "Loading样式",
        lang: "html",
        code: `
          <div class="iconLoading"></div>
        `,
      },
      {
        title: "",
        lang: "css",
        code: `
          <style>
            .iconLoading {
              width: 100px;
              height: 100px;
              border: 6px solid #eee;
              border-left-color: #fff;
              border-radius: 50%;
              animation: loading 1s infinite linear;
            }
            
            @keyframes loading {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          </style>
        `,
      },
    ],
  },
];
