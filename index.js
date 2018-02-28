// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート

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
            var id = '';
            var name = '';
            // ユーザーからのテキストメッセージが「こんにちは」だった場合のみ反応。
            if (event.message.text == "会津 太郎"){
                // replyMessage()で返信し、そのプロミスをevents_processedに追加。
                setName(event.message.text);
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: name
                }));
            } else if(event.message.text == "s1240236"){
                setId(event.message.text);
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: id
                }));
            } else if(event.message.text == "確認"){
                id = getId();
                name = getName();
                events_processed.push(bot.replyMessage(event.replyToken, {
                  type: "text",
                  text: id + ", " + name
                }));
            }
        }
    });

    var id = '';
    var name = '';
    function setId(data){
      id = data;
    }

    function setName(data){
      name = data;
    }

    function getId(){
      return id;
    }

    function getName(){
      return name;
    }
    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});
