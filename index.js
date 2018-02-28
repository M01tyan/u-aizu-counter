// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const mysql = require("mysql"); // MySQlをインポート
var count = 5;

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
          var now = new Date();
          var jisa = (new Date().getTimezoneOffset());
          var month = now.getMonth() + 1;
          var day = now.getDate();
          var year = now.getFullYear();
          var hours = now.getHours();
          var minutes = now.getMinutes();
          var seconds = now.getSeconds();
            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
            //if (event.message.text == "会津 太郎"){
                // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                var id = event.message.text.substr(0,8);
                var name = event.message.text.substr(9, 14);
                /*
                    events_processed.push(bot.replyMessage(event.replyToken, {
                    type: "template",
                    altText: "授業に出席しましたか？",
                    template: {
                      type: "confirm",
                      text: "授業に出席しましたか？",
                      actions: [
                        {
                          type: "message",
                          label: "Yes",
                          text: "はい"
                        },
                        {
                          type: "message",
                          label: "No",
                          text: "いいえ"
                        }
                      ]
                    }
                  }));
                  */
                count -= 1;
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: count
                }));
            //}
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});
