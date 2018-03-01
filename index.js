// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
var userId = '';
var userName = '';
var userDivision = '';
var lesson = [ { name: '', count: ''}];

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
          var id = event.message.text.substr(0,8);
          var name = event.message.text.substr(9, 14);
          events_processed.push(bot.replyMessage(event.replyToken, {
            type: "text",
            text: event.message.text.toUpperCase()
          }));
          //学籍番号と名前の入力形式があっているかチェック
          if(id.match(/s12[0-9]{5}/) && name!=''){
            userId = id;
            userName = name;
            //1,2年生はクラスを入力
            if(id[3] == 6 || id[3] == 5){
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "あなたのクラスを入力してください。"
              }));
              //3,4,5年生はフィールドを入力
            } else if(id[3] == 4 || id[3] == 3 || id[3] == 2){
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: "あなたのフィールドを入力してください。"
              }));
            }
            //入力形式が違う場合はもう一度
          } else {
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: "text",
              text: "もう一度学籍番号と名前を入力してください。"
            }));
          }
          //フィールドがきちんと入力されているかチェック
          if(event.message.text.toUpperCase() == "CS" || event.message.text.toUpperCase() == "SY" ||
             event.message.text.toUpperCase() == "CN" || event.message.text.toUpperCase() == "IT-SPR" ||
             event.message.text.toUpperCase() == "IT-CMV" || event.message.text.toUpperCase() == "SE") {
              userDivision = event.message.text.toUpperCase();
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: userId + ", " + UserName + ", " + userDivision
              }));
            //フィールドがきちんと入力されていない場合はもう一度
          } else {
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: "text",
              text: "もう一度フィールドを入力してください。"
            }));
          }
          //クラスがきちんと入力されているかチェック
          if(event.message.text.toUpperCase() == "C1" || event.message.text.toUpperCase() == "C2" || event.message.text.toUpperCase() == "C3" ||
             event.message.text.toUpperCase() == "C4" || event.message.text.toUpperCase() == "C5" || event.message.text.toUpperCase() == "C6"){
              userDivision = event.message.text.toUpperCase();
              events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: userId + ", " + UserName + ", " + userDivision
              }));
          //クラスがきちんと入力されていない場合はもう一度
          } else {
            events_processed.push(bot.replyMessage(event.replyToken, {
              type: "text",
              text: "もう一度クラスを入力してください。"
            }));
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
