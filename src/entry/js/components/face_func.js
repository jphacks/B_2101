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
  var faceWidth = positions[11][0]-positions[3][0]
  var lipWidth = positions[50][0] - positions[44][0]
  var xMouth = lipWidth/faceWidth

  var faceHeight = positions[37][1] - positions[7][1]
  var lipHeightLeft = positions[44][1] - positions[7][1]
  var lipHeightRight = positions[50][1] - positions[7][1]
  var yMouthLeft = lipHeightLeft/faceHeight
  var yMouthRight = lipHeightRight/faceHeight
  
  // 顔部品の現在位置を比較用変数に代入して値を更新する
  var positionStorage = positions
  //console.log(positionStorage[3][0]);
    }

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
  //console.log('右口角の座標');
  //console.log('x座標：「'+pos[44][0]+'」y座標：「' + pos[44][1] + '」');
  //console.log('左口角の座標');
  //console.log('x座標：「' + pos[50][0] + '」y座標：「' + pos[50][1] + '」');

  //距離の基底
  var abs_dis_x = pos[14][0]-pos[0][0]
  var abs_dis_y = pos[0][1]-pos[1][1]

  //console.log('abs_dis:'+abs_dis_x);
  
  
  console.log('正規化後の口角の座標');
  console.log('相対x座標(50-44)：「' + Math.round(1000*(pos[50][0] - pos[44][0])/abs_dis_x) + '」');

  //console.log('相対x座標(50-44)：「' + Math.round(1000*(pos[50][0] - pos[44][0])/abs_dis_x) + '」y座標：「' + Math.round(-1*(pos[44][1] - pos[2][1])+(pos[50][1] - pos[12][1])/abs_dis_y*2)+ '」');
  //console.log('x座標(11-3)：「' + Math.round(100*(pos[11][0] - pos[3][0])/abs_dis) + '」y座標：「' + Math.round(pos[50][1] - pos[3][1] )+ '」');
  //console.log('頬：「' + Math.round(pos[11][0] - pos[3][0]) + '」くちびる：「' + Math.round(pos[50][0] - pos[44][0] )+ '」');
  //console.log('鼻下: 「'+Math.round(pos[37][1] - pos[7][1]) + '」唇: 「'+Math.round(pos[44][1] - pos[7][1])+'」');




  
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
