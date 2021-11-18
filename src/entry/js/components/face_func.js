var video = document.getElementById("video");
var canvas = document.getElementById("faceCanvas");
var context = canvas.getContext("2d");

var positionStorage = null;

// getUserMedia によるカメラ映像の取得
// メディアデバイスを取得
var media = navigator.mediaDevices.getUserMedia({
  // カメラの映像を使う（スマホならインカメラ）
  video: {facingMode: "user"},
  // マイクの音声は使わない
  audio: false
});

// メディアデバイスが取得できたら
media.then((stream) => {
  // video 要素にストリームを渡す
  video.srcObject = stream;
});

// clmtrackr の開始
// tracker オブジェクトを作成
var tracker = new clm.tracker();
// tracker を所定のフェイスモデル（※）で初期化
tracker.init(pModel);
// video 要素内でフェイストラッキング開始
tracker.start(video);

var ouen_flag_ao = 0
var ouen_flag_u = 0
var ouen_flag_ie = 0

// 描画ループ
function drawLoop() {
  // drawLoop 関数を繰り返し実行
  requestAnimationFrame(drawLoop);

  // 比較用変数に値が入っているか確認
  /*if (positionStorage != null) {
    console.log(positionStorage[3][0]);}
  */
  // 顔部品の現在位置の取得
  var positions = tracker.getCurrentPosition();

  
    //ここで現在位置と前回位置の計算を行う
    //x方向の値を計算する
  if(positions != false){
  /*
  // 顔部品の現在位置を比較用変数に代入して値を更新する
  var positionStorage = positions
  //console.log(positionStorage[3][0]);

  */
  //距離基底
  var abs_dis_x = positions[14][0]-positions[0][0]

  var abs_x = Math.round(1000*(positions[50][0] - positions[44][0])/abs_dis_x)
  var abs_y = Math.round(1000*(positions[53][1] - positions[47][1])/abs_dis_x)

  console.log('正規化後の口角の座標');
  console.log('相対x座標(50-44)：「' + abs_x + '」');
  console.log('相対y座標(53-47)：「' + abs_y + '」');
  /*
  console.log('----------------------------------');
  console.log('53：「' + positions[53][1] + '」');
  console.log('47：「' + positions[47][1]+ '」');
  console.log('abs_d：「' + abs_dis_x + '」');
  */

  //あ，お 応援フラグ
  if (abs_y>190){
    ouen_flag_ao=3 //がんばった
  }else if (abs_y>170){
    ouen_flag_ao=2 //あとちょっと
  }else{
    ouen_flag_ao=1 //もっと頑張れ
  }

  //う 応援フラグ
  if (abs_x<370){
    ouen_flag_u=3 //がんばった
  }else if (abs_x<380){
    ouen_flag_u=2 //あとちょっと
  }else{
    ouen_flag_u=1 //もっと頑張れ
  }

  //い，え 応援フラグ
  if (abs_x>420){
    ouen_flag_ie=3 //がんばった
  }else if (abs_x>400){
    ouen_flag_ie=2 //あとちょっと
  }else{
    ouen_flag_ie=1 //もっと頑張れ
  }

  console.log('あ，お　応援フラグ:「' + ouen_flag_ao + '」')
  console.log('う　応援フラグ:「' + ouen_flag_u + '」')
  console.log('い，え　応援フラグ:「' + ouen_flag_ie + '」')



  
  // canvas をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);
  // canvas にトラッキング結果を描画
  tracker.draw(canvas);

    }
  else{
  // canvas をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);
  }


  // 四角を表示
  //context.beginPath();
  // https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D/fillRect
  // context.strokeRect(四角のx座標, 四角のy座標, 四角の横幅, 四角の縦幅);
  //context.strokeRect(120, 75, 150, 150);


}
// drawLoop関数の初回実行
drawLoop();


