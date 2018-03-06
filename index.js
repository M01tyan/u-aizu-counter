// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const fs = require("fs");
var userId = '';
var userName = '';
var userGrade = '';
var userDivision = '';
var i = 0;
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
            var id = event.message.text.substr(0,8);
            var name = event.message.text.substr(9, 14);
            //学籍番号と名前の入力形式があっているかチェック
            if(id.match(/s12[0-9]{5}/) && name!=''){
              userId = id;
              userName = name;
              //1,2年生はクラスを入力
              if(id[3] == 6 || id[3] == 5){
                mode = "divisionInit";
                var json = read("Thrid_first.json");
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
                    text: json
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
                text: "もう一度学籍番号と名前を入力してください。"
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
                  text: "<学籍番号>\n" +
                        "　" + userId + "\n" +
                        "<名前>\n" +
                        "　" + userName + "\n" +
                        "<学年>\n" +
                        "　" + userGrade + "\n" +
                        "<フィールド>\n" +
                        "　" + userDivision
                }));
              } else if(userGrade == "1年" || userGrade == "2年") {
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: "<学籍番号>\n" +
                        "　" + userId + "\n" +
                        "<名前>\n" +
                        "　" + userName + "\n" +
                        "<学年>\n" +
                        "　" + userGrade + "\n" +
                        "<クラス>\n" +
                        "　" + userDivision
                }));
              }
            } else if(event.message.text == "追加"){
              mode = "addclass";
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
            }
          } else if(mode == "addclass"){
            events_processed.push(bot.replyMessage(event.replyToken, [
              {
                type: "text",
                text: "あなたが履修中の授業名を\n入力してください\n" +
                      "\n例：\n" +
                      "MA01 線形代数I\n" +
                      "線形代数I\n" +
                      "MA01"
              },{
                type: "text",
                text: "授業追加を終了するときは\n終了と入力してください。"
              }
            ]));
            if(event.message.text == "終了"){
              mode = "base";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "授業追加モードを終了します。"
              }));
            } else {
              let class_count = {
                thumbnailImageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/count5.jpg",
                imageBackgroundColor: "#FFFFFF",
                title: "",
                text: "description",
                actions: [
                    {
                        type: "postback",
                        label: "Buy",
                        data: "action=buy&itemid=111"
                    },
                    {
                        type: "postback",
                        label: "Add to cart",
                        data: "action=add&itemid=111"
                    },
                    {
                        type: "uri",
                        label: "View detail",
                        uri: "http://example.com/page/111"
                    }
                ]
              };
              class_count.title = event.message.text;
              absence_count.template.columns.push(class_count);
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: event.message.text + "を追加しました。"
              }));
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

function read(file){
  var content = new String();
  content = fs.readFileSync(this.file, 'utf8');
  return content;
}
