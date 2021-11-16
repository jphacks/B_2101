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

var ouen_flag = 0

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

  console.log('正規化後の口角の座標');
  console.log('相対x座標(50-44)：「' + abs_x + '」');

  
  if (abs_x>420){
    ouen_flag=3 //がんばった
  }else if (abs_x>400){
    ouen_flag=2 //あとちょっと
  }else if (abs_x>380){
    ouen_flag=1 //もっと頑張れ
  }

  console.log('応援フラグ:「' + ouen_flag + '」')



  
  // データの表示
  showData(positions);
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
  context.beginPath();
  // https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D/fillRect
  // context.strokeRect(四角のx座標, 四角のy座標, 四角の横幅, 四角の縦幅);
  context.strokeRect(120, 75, 150, 150);


}
// drawLoop関数の初回実行
drawLoop();

// 顔部品（特徴点）の位置データを表示する showData 関数
function showData(pos) {

  // データの文字列を入れる変数
  var str = "";
  // 全ての特徴点（71個）について
  for(var i = 0; i < pos.length; i++) {
    str += "特徴点" + i + ": ("
      // X座標（四捨五入して整数に）
      + Math.round(pos[i][0]) + ", "
      // Y座標（四捨五入して整数に）
      + Math.round(pos[i][1]) + ")<br>";
  }
  // データ表示用div要素の取得
  var dat = document.getElementById("dat");
  // データ文字列の表示
  dat.innerHTML = str;

}
