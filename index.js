// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
var userId = '';
var userName = '';
var userGrade = '';
var userDivision = '';
var addcnt;
var semester = 0;
var mode = "init";
var lesson = [];
var absence_count = {
  type: "template",
  altText: "this is a carousel template",
  template: {
      type: "carousel",
      columns: [],
      imageAspectRatio: "square",
      imageSize: "cover"
    }
};
// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);


// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// -----------------------------------------------------------------------------
// ルーター設定
//https://u-aizu-counter.herokuapp.com/webhook
//https://a4c817cf.ngrok.io
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);
    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];
    // イベントオブジェクトを順次処理。
    req.body.events.map((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
          //ユーザー登録モード
          if(mode == "init"){
            /*
            if(event.message.text == "あ"){
              var test = JSON.parse(thrid);
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: test[0].name
              }));
            }*/
            var id = event.message.text.substr(0,8);
            var name = event.message.text.substr(9, 14);
            //学籍番号と名前の入力形式があっているかチェック
            if(id.match(/s12[0-9]{5}/) && name!=''){
              userId = id;
              userName = name;
              //1,2年生はクラスを入力
              if(id[3] == 6 || id[3] == 5){
                mode = "divisionInit";
                events_processed.push(bot.replyMessage(event.replyToken, [
                  {
                    type: "text",
                    text: "あなたのクラスをタップしてください。"
                  },{
                    type: "template",
                    altText: "あなたのクラスをタップしてください。",
                    template: {
                      type: "image_carousel",
                      columns: [
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/c1.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "C1"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/c2.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "C2"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/c3.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "C3"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/c4.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "C4"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/c5.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "C5"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/c6.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "C6"
                          }
                        }
                      ]
                    }
                  }, {
                    type: "text",
                    text: ok
                  }
                ]));
                if(id[3] == 6) {
                  userGrade = "1年";
                } else if(id[3] == 5) {
                  userGrade = "2年";
                }
                //3,4,5年生はフィールドを入力
              } else if(id[3] == 4 || id[3] == 3){
                mode = "divisionInit";
                events_processed.push(bot.replyMessage(event.replyToken, [
                  {
                    type: "text",
                    text: "あなたのフィールドをタップしてください。"
                  },{
                    type: "template",
                    altText: "あなたのフィールドをタップしてください。",
                    template: {
                      type: "image_carousel",
                      columns: [
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/cs.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "CS"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/sy.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "SY"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/cn.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "CN"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/it_spr.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "IT-SPR"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/it_cmv.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "IT-CMV"
                          }
                        },
                        {
                          imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/se.jpg",
                          action: {
                            type: "message",
                            label: "選択",
                            text: "SE"
                          }
                        }
                      ]
                    }
                  }
                ]));
                if(id[3] == 4) {
                  userGrade = "3年";
                } else if(id[3] == 3) {
                  userGrade = "4年";
                }
              }
              //入力形式が違う場合はもう一度
            } else {
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "もう一度学籍番号と名前を入力\nしてください。"
              }));
            }
          } else if(mode == "divisionInit") {
            //フィールドが選択されているかチェック
            if(event.message.text.substr(0,2) == "CS" || event.message.text.substr(0,2) == "SY" ||
            event.message.text.substr(0,2) == "CN" || event.message.text.substr(0,6) == "IT-SPR" ||
            event.message.text.substr(0,6) == "IT-CMV" || event.message.text.substr(0,2) == "SE") {
              userDivision = event.message.text;
              mode = "base";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "ユーザー登録が完了しました。"
              }));
            }
            //クラスが選択と入力されているかチェック
            else if(event.message.text.substr(0,2).match(/C[1-6]{1}/)){
              userDivision = event.message.text;
              mode = "base";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "ユーザー登録が完了しました。"
              }));
            }
            //基本画面モード
          } else if(mode == "base"){
            if(event.message.text == "ユーザー情報"){
              if(userGrade == "3年" || userGrade == "4年"){
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: "学籍番号\n" +
                        "　" + userId + "\n" +
                        "\n名前\n" +
                        "　" + userName + "\n" +
                        "\n学年\n" +
                        "　" + userGrade + "\n" +
                        "\nフィールド\n" +
                        "　" + userDivision
                }));
              } else if(userGrade == "1年" || userGrade == "2年") {
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: "学籍番号\n" +
                        "　" + userId + "\n" +
                        "\n名前\n" +
                        "　" + userName + "\n" +
                        "\n学年\n" +
                        "　" + userGrade + "\n" +
                        "\nクラス\n" +
                        "　" + userDivision
                }));
              }
            } else if(event.message.text == "追加"){
              mode = "addclass";
              addcnt = 0;
              events_processed.push(bot.replyMessage(event.replyToken, {
                "type": "template",
                "altText": "This is a buttons template",
                "template": {
                    "type": "buttons",
                    "imageSize": "cover",
                    "imageBackgroundColor": "#FFFFFF",
                    "text": "授業を追加する学期を選んでください。",
                    "actions": [
                        {
                          "type": "message",
                          "label": "1学期",
                          "text": "1学期"
                        },
                        {
                          "type": "message",
                          "label": "2学期",
                          "text": "2学期"
                        },
                        {
                          "type": "message",
                          "label": "3学期",
                          "text": "3学期"
                        },
                        {
                          "type": "message",
                          "label": "4学期",
                          "text": "4学期"
                        }
                    ]
                }
              }));
              //ヘルプモード
            } else if(event.message.text == "ヘルプ"){
              mode = "help";
            } else if(event.message.text == "欠席数カウント"){
              //mode = "absence";
              events_processed.push(bot.replyMessage(event.replyToken, absence_count));
            } else if(event.message.text == "ユーザー登録"){
              events_processed.push(bot.replyMessage(event.replyToken, [
                {
                  type: "text",
                  text: "ユーザー情報を再登録します。"
                },{
                    type: "text",
                    text: "あなたの学籍番号と名前を入力してください。\n\n" +
                          "例：\n" +
                          "s12xxxxx\n" +
                          "会津　太郎"
                }
              ]));
              mode = "init";
              userId = '';
              userName = '';
              userGrade = '';
              userDivision = '';
              for(var i=0; i<absence_count.template.columns.length; i++){
                  absence_count.template.columns[i] = '';
              }
            }
          } else if(mode == "addclass"){
            if(addcnt == 0){
              addcnt += 1;
              events_processed.push(bot.replyMessage(event.replyToken, [
                {
                  type: "text",
                  text: "あなたが履修中の授業名を\n入力してください\n" +
                  "\n例：\n" +
                  "MA01 線形代数 I\n" +
                  "線形代数 I\n" +
                  "MA01"
                },{
                  type: "text",
                  text: "授業追加を終了するときは\n終了と入力してください。"
                }
              ]));
            } else if(event.message.text === "終了"){
              mode = "base";
              addcnt = 0;
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "授業追加モードを終了します。"
              }));
            } else if(event.message.text == "1学期"){
              semester = 0;
            } else if(event.message.text == "2学期"){
              semester = 1;
            } else if(event.message.text == "3学期"){
              semester = 2;
            } else if(event.message.text == "4学期"){
              semester = 3;
            } else {
              let class_count = {
                thumbnailImageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/count5.jpg",
                imageBackgroundColor: "#FFFFFF",
                title: "",
                text: "ok",
                actions: [
                    {
                        type: "message",
                        label: "詳細",
                        text: "詳細"
                    }, {
                        type: "message",
                        label: "削除",
                        text: "削除"
                    }
                ]
              };
              if(userGrade == "3年"){
                if(userDivision == "IT-SPR"){
                  for(var j=0; j<spr_third[semester].length; j+=1){
                    if(event.message.text == spr_third[semester][j].name || event.message.text == spr_third[semester][j].code || event.message.text == spr_third[semester][j].code + " " + spr_third[semester][j].name){
                      class_count.title = spr_third[semester][j].code + " " + spr_third[semester][j].name;
                      var table = spr_third[semester][j].table.split(",");
                      var time = spr_third[semester][j].time.split(",");
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: table[0] + " " + time[0]
                      }));
                      /*
                      for(var k=0; k<table.length; k+=1){
                        class_count.text += table[k] + " " + time[k] + "\n";
                      }
                      */
                      class_count.text += "教室：" + spr_third[semester][j].room + "　教授：" + spr_third[semester][j].instructor + "\n単位数：" + spr_third[semester][j].credits;
                      absence_count.template.columns.push(class_count);
                      events_processed.push(bot.replyMessage(event.replyToken, {
                        type: "text",
                        text: spr_third[semester][j].code + " " + spr_third[semester][j].name + "を追加しました。"
                      }));
                      break;
                    }
                  }
                  if(j == spr_third[semester].length) {
                    events_processed.push(bot.replyMessage(event.replyToken, {
                      type: "text",
                      text: "授業がありません\nもう一度入力してください"
                    }));
                  }
                }
              }
            }
          }
        }
    });
    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});

//授業情報
const spr_third = [
  [
    //1学期
    {table: "月1, 月2, 木1, 木2", time: "09:00 ~ 09:50, 09:50 ~ 10:40, 09:00 ~ 09:50, 09:50 ~ 10:40", code: "EL244", name: "An Introduction to Cross-cultural Communication", credits: "2", room: "CALL2", instructor: "Allan Nicholas"},
    {table: "月1, 月2, 木1, 木2", time: "09:00 ~ 09:50, 09:50 ~ 10:40, 09:00 ~ 09:50, 09:50 ~ 10:40", code: "EL313", name: "Digital Storytelling for Engineering Narratives", credits: "2", room: "CALL1", instructor: "ジョン　ブライン"},
    {table: "月1, 月2, 木1, 木2", time: "09:00 ~ 09:50, 09:50 ~ 10:40, 09:00 ~ 09:50, 09:50 ~ 10:40", code: "EL315", name: "User Experience Research", credits: "2", room: "iLab1", instructor: "デボプリオ　ロイ"},
    {table: "月1, 月2, 木1, 木2", time: "09:00 ~ 09:50, 09:50 ~ 10:40, 09:00 ~ 09:50, 09:50 ~ 10:40", code: "EL328", name: "Logic and language", credits: "2", room: "iLab2", instructor: "ジョン　ブレイク"},
    {table: "月3, 月4, 木3, 木4", time: "10:50 ~ 11:40, 11:40 ~ 12:30, 10:50 ~ 11:40, 11:40 ~ 12:30", code: "IT08", name: "信号処理と線形システム", credits: "4", room: "M6", instructor: "朱　欣"},
    {table: "月5, 月6, 木5, 木6", time: "13:20 ~ 14:10, 14:10 ~ 15:00, 13:20 ~ 14:10, 14:10 ~ 15:00", code: "IT08", name: "信号処理と線形システム[演]", credits: "4", room: "std2", instructor: "朱　欣"},
    {table: "月7, 月8, 木7, 木8", time: "15:10 ~ 16:00, 16:00 ~ 16:50, 15:10 ~ 16:00, 16:00 ~ 16:50", code: "EL317", name: "Patterns and language", credits: "2", room: "CALL1", instructor: "ジョン　ブレイク"},
    {table: "月7, 月8, 木7, 木8", time: "15:10 ~ 16:00, 16:00 ~ 16:50, 15:10 ~ 16:00, 16:00 ~ 16:50", code: "NS03", name: "量子力学", credits: "2", room: "M2", instructor: "本間　道雄"},
    {table: "月7, 月8, 木7, 木8", time: "15:10 ~ 16:00, 16:00 ~ 16:50, 15:10 ~ 16:00, 16:00 ~ 16:50", code: "OT01-I", name: "ベンチャー基本コース各論 I", credits: "2", room: "M1", instructor: "程　子学, 石橋　史朗"},
    {table: "月8, 月9, 木8, 木9", time: "16:00 ~ 16:50, 17:00 ~ 17:50, 16:00 ~ 16:50, 17:00 ~ 17:50", code: "FU06", name: "オペレーティングシステム論[再]", credits: "4", room: "M6", instructor: "松本　和也"},
    {table: "月9, 月10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT02-1", name: "ベンチャー体験工房 1", credits: "1", room: "-", instructor: "程　子学, 荊　雷"},
    {table: "月9, 月10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT02-2", name: "ベンチャー体験工房 2", credits: "1", room: "-", instructor: "出村　裕英, 平田　成, 小川　佳子, 本田　親寿, 北里　宏平, 奥平　恭子, 石橋　史朗"},
    {table: "月9, 月10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT02-3", name: "ベンチャー体験工房 3", credits: "1", room: "-", instructor: "吉良　洋輔"},
    {table: "月9, 月10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT02-6", name: "ベンチャー体験工房 6", credits: "1", room: "-", instructor: "吉岡　廉太郎, 星野　隆之（日本ユニシス）"},
    {table: "月9, 月10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT02-7", name: "ベンチャー体験工房 7", credits: "1", room: "-", instructor: "石橋　史朗, サバシュ　バーラ"},
    {table: "月9, 月10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT02-9", name: "ベンチャー体験工房 9", credits: "1", room: "-", instructor: "陳　文西"},
    {table: "月9, 月10, 木9, 木10", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 17:00 ~ 17:50, 17:50 ~ 18:40", code: "TE05", name: "教育方法", credits: "2", room: "M2", instructor: "-"},
    {table: "月10, 月11, 木10, 木11", time: "17:50 ~ 18:40, 18:50 ~ 19:40, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "FU06", name: "オペレーティングシステム論[再][演]", credits: "4", room: "std5, std6", instructor: "松本　和也, 大井　仁"},
    {table: "火1, 火2, 金1, 金2", time: "09:00 ~ 09:50, 09:50 ~ 10:40, 09:00 ~ 09:50, 09:50 ~ 10:40", code: "FU09", name: "アルゴリズムとデータ構造 II", credits: "3", room: "M4", instructor: "浅井　信吉"},
    {table: "火3, 金3", time: "10:50 ~ 11:40, 10:50 ~ 11:40", code: "FU09", name: "アルゴリズムとデータ構造 II[演]", credits: "3", room: "std6", instructor: "鈴木　大郎"},
    {table: "火5, 火6, 金5, 金6", time: "13:20 ~ 14:10, 14:10 ~ 15:00, 13:20 ~ 14:10, 14:10 ~ 15:00", code: "FU05", name: "コンピュータアーキテクチャ論", credits: "4", room: "M6", instructor: "西村　憲"},
    {table: "火7, 火8, 金7, 金8", time: "15:10 ~ 16:00, 16:00 ~ 16:50, 15:10 ~ 16:00, 16:00 ~ 16:50", code: "FU05", name: "コンピュータアーキテクチャ論[演]", credits: "4", room: "hdw2", instructor: "ウォンミィング　チュー"},
    {table: "水2, 水3, 水4", time: "09:50 ~ 10:40, 10:50 ~ 11:40, 11:40 ~ 12:30", code: "IE01", name: "システム総合演習 I", credits: "3", room: "-", instructor: "--"},
    {table: "水2, 水3, 水4", time: "09:50 ~ 10:40, 10:50 ~ 11:40, 11:40 ~ 12:30", code: "IE03", name: "ソフトウェア総合演習 I", credits: "3", room: "std6", instructor: "朱　欣"},
    {table: "水5, 水6", time: "13:20 ~ 14:10, 14:10 ~ 15:00", code: "OT08", name: "TOEIC準備コース(Level A)", credits: "1", room: "LTh", instructor: "桑田　カツ子"},
    {table: "水5, 水6, 水7, 水8", time: "13:20 ~ 14:10, 14:10 ~ 15:00, 15:10 ~ 16:00, 16:00 ~ 16:50", code: "TE04", name: "教育課程論", credits: "2", room: "M4", instructor: "-"},
    {table: "水7, 水8", time: "15:10 ~ 16:00, 16:00 ~ 16:50", code: "OT08", name: "TOEIC準備コース(Level B", credits: "1", room: "iLab2", instructor: "桑田　カツ子"},
    {table: "水9, 水10", time: "17:00 ~ 17:50, 17:50 ~ 18:40", code: "OT05", name: "キャリアデザイン I", credits: "1", room: "M6", instructor: "杉山　雅英"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-001", name: "大規模分散Webインフラ構築入門", credits: "1", instructor: "阿部　泰裕 "},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-002", name: "月惑星データ解析&国際宇宙ステーションたんぽぽプロジェクト", credits: "1", instructor: "出村　裕英, 平田　成, 小川　佳子, 北里　宏平, 奥平　恭子, 本田　親寿"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-004", name: "天文データを用いたRによる統計解析入門", credits: "1", instructor: "石橋　史朗"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-005", name: "教師になろう!", credits: "1", instructor: "苅間澤　勇人"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-006", name: "理工系学生のための異文化理解及び地域イノベーション", credits: "1", instructor: "川口　立喜"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-007", name: "手作りマイコンプロジェクト", credits: "1", instructor: "北道　淳司"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-008", name: "環境センシングと家電コントロール ～IoT入門～", credits: "1", instructor: "小平　行秀"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-009", name: "プログラム可視化によるC言語学習支援手法", credits: "1", instructor: "黒川　弘国"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-010", name: "Virtual system experiments on human cognition near its threshold", credits: "1", instructor: "イゴール　ルバシェフスキー, マキシム　モズゴボイ"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-011", name: "論理的に", credits: "1", instructor: "森　和好"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-012", name: "並列プログラミングチャレンジ", credits: "1", instructor: "中里　直人"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-013", name: "競技用ロボットの開発", credits: "1", instructor: "成瀬　継太郎"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-014", name: "コンピュータを使った音と映像のコンテンツ制作", credits: "1", instructor: "西村　憲"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-015", name: "A Peek Inside Computers", credits: "1", instructor: "大井　仁"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-016", name: "自作プロセッサのための電子工作プロジェクト", credits: "1", instructor: "奥山　祐市"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-017", name: "マナビーノ　アードゥイーノ", credits: "1", instructor: "大津山　公平"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-018", name: "多変量解析方法による機械学習と計算知能", credits: "1", instructor: "裴　岩"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-019", name: "人工知能を搭載したラジコンの開発", credits: "1", instructor: "齋藤　寛, 富岡　洋一"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-020", name: "ベンチャービジネス（コンテンツビジネス）・地域活性化プロジェクト", credits: "1", instructor: "清野　正哉"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-021", name: "公務員試験等対策講座", credits: "1", instructor: "清野　正哉"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-022", name: "Advanced Pattern Recognition and Software Development", credits: "1", instructor: "愼 重弼"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-023", name: "Korean IT and Culture Study", credits: "1", instructor: "愼 重弼"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-024", name: "Practical application & network defense", credits: "1", instructor: "アレクサンダー　ヴァジェニン"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-025", name: "競技プログラミング", credits: "1", instructor: "渡部　有隆"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-026", name: "実践的プログラミング", credits: "1", instructor: "渡部　有隆"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-027", name: "活性知識工学を用いた人に優しいユーザインタフェースの開発", credits: "1", instructor: "吉岡　廉太郎"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-028", name: "立体形状物のモデリングと造形", credits: "1", instructor: "吉岡　廉太郎"},
    {table: "木9, 木10, 木11", time: "17:00 ~ 17:50, 17:50 ~ 18:40, 18:50 ~ 19:40", code: "OT03-029", name: "探索工房：AIは探索である", credits: "1", instructor: "趙　強福"}
  ], [

  ], [

  ], [

  ]
];
