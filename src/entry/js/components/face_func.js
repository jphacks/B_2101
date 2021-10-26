var video = document.getElementById("video");
var canvas = document.getElementById("faceCanvas");
var context = canvas.getContext("2d");

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

// 描画ループ
function drawLoop() {
  // drawLoop 関数を繰り返し実行
  requestAnimationFrame(drawLoop);
  // 顔部品の現在位置の取得
  var positions = tracker.getCurrentPosition();
  // データの表示
  showData(positions);
  // canvas をクリア
  context.clearRect(0, 0, canvas.width, canvas.height);
  // canvas にトラッキング結果を描画
  tracker.draw(canvas);
}
// drawLoop関数の初回実行
drawLoop();

// 顔部品（特徴点）の位置データを表示する showData 関数
function showData(pos) {
  //test
  console.log('右口角の座標');
  console.log('x座標：「'+pos[44][0]+'」y座標：「' + pos[44][1] + '」');
  console.log('左口角の座標');
  console.log('x座標：「' + pos[50][0] + '」y座標：「' + pos[50][1] + '」');
  console.log('2点の差');
  console.log('x座標：「' + Math.round(pos[50][0] - pos[44][0]) + '」y座標：「' + Math.round(pos[50][1] - pos[44][1] )+ '」');

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
