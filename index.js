// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
var userId = '';
var userName = '';
var userDivision = '';
var lesson = [];
var mode = "init";
const count5 = "count5.jpg";
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
                events_processed.push(bot.replyMessage(event.replyToken, {

                }));
                //3,4,5年生はフィールドを入力
              } else if(id[3] == 4 || id[3] == 3 || id[3] == 2){
                mode = "divisionInit";
                events_processed.push(bot.replyMessage(event.replyToken, {
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
                          data: "CS"
                        }
                      },
                      {
                        imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/sy.jpg",
                        action: {
                          type: "message",
                          label: "選択",
                          data: "SY"
                        }
                      },
                      {
                        imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/cn.jpg",
                        action: {
                          type: "message",
                          label: "選択",
                          data: "CN"
                        }
                      },
                      {
                        imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/it_spr.jpg",
                        action: {
                          type: "message",
                          label: "選択",
                          data: "IT-SPR"
                        }
                      },
                      {
                        imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/it_cmv.jpg",
                        action: {
                          type: "message",
                          label: "選択",
                          data: "IT-CMV"
                        }
                      },
                      {
                        imageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/se.jpg",
                        action: {
                          type: "message",
                          label: "選択",
                          data: "SE"
                        }
                      }
                    ]
                  }
                }));
              }
              //入力形式が違う場合はもう一度
            } else {
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "もう一度学籍番号と名前を入力してください。"
              }));
            }
          } else if(mode == "divisionInit") {
            //フィールドがきちんと入力されているかチェック
            if(event.message.text.substr(0,2) == "CS" || event.message.text.substr(0,2) == "SY" ||
            event.message.text.substr(0,2) == "CN" || event.message.text.substr(0,6) == "IT-SPR" ||
            event.message.text.substr(0,6) == "IT-CMV" || event.message.text.substr(0,2) == "SE") {
              userDivision = event.message.text;
              mode = "base";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "ユーザー登録が完了しました。"
              }));
              //フィールドがきちんと入力されていない場合はもう一度
            } else if(event.message.text.substr(0,2) != "CS" || event.message.text.substr(0,2) != "SY" ||
                      event.message.text.substr(0,2) != "CN" || event.message.text.substr(0,6) != "IT-SPR" ||
                      event.message.text.substr(0,6) != "IT-CMV" || event.message.text.substr(0,2) != "SE"){
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: "もう一度フィールドを入力してください。"
                }));
            }
            //クラスがきちんと入力されているかチェック
            if(event.message.text.substr(0,2).match(/C[1-6]{1}/)){
              userDivision = event.message.text;
              mode = "base";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "ユーザー登録が完了しました。"
              }));
              //クラスがきちんと入力されていない場合はもう一度
            } else if(!event.message.text.substr(0,2).match(/C[1-6]{1}/)){
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "もう一度クラスを入力してください。"
              }));
            }
            //基本画面モード
          } else if(mode == "base"){
            if(event.message.text == "ユーザー情報"){
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "学籍番号　　<" + userId + ">\n" +
                      "名前　　　　<" + userName + ">\n" +
                      "フィールド　<" + userDivision + ">"
              }));
            } else if(event.message.text == "追加"){
              mode = "addclass";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "あなたが履修中の授業名を\n入力してください\n" +
                      "\n例：\n" +
                      "MA01 線形代数I\n" +
                      "線形代数I\n" +
                      "MA01"
              }));
              //ヘルプモード
            } else if(event.message.text == "ヘルプ"){
              mode = "help";
            } else if(event.message.text == "欠席数カウント"){
              //mode = "absence";
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "template",
                altText: "this is a carousel template",
                template: {
                    type: "carousel",
                    columns: [
                        {
                          thumbnailImageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/count5.jpg",
                          imageBackgroundColor: "#FFFFFF",
                          title: "this is menu",
                          text: "description",
                          defaultAction: {
                              type: "uri",
                              label: "View detail",
                              uri: "http://example.com/page/123"
                          },
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
                        },
                        {
                          thumbnailImageUrl: "https://raw.githubusercontent.com/M01tyan/u-aizu-counter/master/img/count5.jpg",
                          imageBackgroundColor: "#000000",
                          title: "this is menu",
                          text: "description",
                          defaultAction: {
                              type: "uri",
                              label: "View detail",
                              uri: "http://example.com/page/222"
                          },
                          actions: [
                              {
                                  type: "postback",
                                  label: "Buy",
                                  data: "action=buy&itemid=222"
                              },
                              {
                                  type: "postback",
                                  label: "Add to cart",
                                  data: "action=add&itemid=222"
                              },
                              {
                                  type: "uri",
                                  label: "View detail",
                                  uri: "http://example.com/page/222"
                              }
                          ]
                        }
                    ],
                    imageAspectRatio: "square",
                    imageSize: "cover"
                }
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
