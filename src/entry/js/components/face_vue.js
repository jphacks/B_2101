import { isThisTypeNode } from "typescript";
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

const face = new Vue({
  el: '#face',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    modeChoicePage: true,
    beginnerPage: false,
    advancedPage: false,
    startBtn: true,
    nextBtnArea: false,
    advancedStartBtn: true,
    hanamaru: false,
    cameraChangeBtn: false,
    modelMessage: 'どちらのモードにしますか？',
    tutorialTitle: 'にこトレの使い方',
    tutorialText: ['初心者モードでは、ミライ小町ちゃんと一緒に「あいうえお体操」のやり方を1つずつ確認しながら進めていきます。', '口を全体に大きく「あ」の形に開け、目を最大限に大きく見開き、眉毛をできるだけ上に上げます。', '口を横に大きく「い」の形に開け、顔全体を横に引っ張る意識で思い切り力を入れます。', '口をできるだけすぼめて「う」の形を作り、目はギュッと閉じ、顔のすべてのパーツを中心に集めるつもりで力を入れます。', '口を横に大きく「え」の形に開け、目は大きく見開き、口角を引き上げた位置でキープします。', '口を縦に大きく「お」の形に開け、目は驚いたときのように大きく見開き、顔全体を縦に引っ張る意識で力を入れます。'],
    advancedText: [
      { id: '0', text: '・「あ」', check: '' },
      { id: '1', text: '・「い」', check: '' },
      { id: '2', text: '・「う」', check: '' },
      { id: '3', text: '・「え」', check: '' },
      { id: '4', text: '・「お」', check: '' }
    ],
    tutorialCountNum: 0,
    startBtnMessage: 'はじめる',
    nextBtnMessage: '次へ進む',
    faceShowToggle: false,
    cameraChangeToggle: false,
    animationFlag: -5, //ページの初期番号 camera位置修正に使う
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRatio: 0,
    faceCanvasWidth: 0,
    faceCanvasHeight: 0,
    faceCanvasRatio: 0,
    modelAndDialogueFlex: ''
  },
  mounted: function () {
    var canvas = document.getElementById('canvas')
    this.canvasWidth = canvas.clientWidth
    this.canvasHeight = canvas.clientHeight
    this.canvasRatio = this.canvasHeight / this.canvasWidth
    var faceCanvas = document.getElementById('faceCanvas')
    this.faceCanvasWidth = faceCanvas.clientWidth
    this.faceCanvasHeight = faceCanvas.clientHeight
    this.faceCanvasRatio = this.faceCanvasHeight/this.faceCanvasWidth
  },
  methods: {
    beginnerMode: function () {
      this.modelMessage = '一緒に頑張りましょう！'
      var sound = document.getElementById('vueSound').value
      if (sound == 1) {
        const cheer_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_11.wav")
        cheer_voice.play()
      }
      this.modeChoicePage=false
      this.beginnerPage = true
    },
    advancedMode: function () {
      this.modelMessage = 'さっそく始めましょう！'
      var sound = document.getElementById('vueSound').value
      if (sound == 1) {
        const cheer_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_11.wav")
        cheer_voice.play()
      }
      this.modeChoicePage=false
      this.advancedPage=true
    },
    advancedStart: function () {
      var sound = document.getElementById('vueSound').value
      if (sound == 1) {
        const try_se = new Audio("./static/sound/sound_effect/try.mp3")
        try_se.play()
      }
      const advancedMessage = ['まずは「あ」です！', '次は「い」です！', '次は「う」です！', '次は「え」です！', '最後は「お」です！', 'お疲れ様でした！']
      console.log('start!!')
      this.advancedStartBtn = false
      let count = 0;
      this.animationFlag = 1
      this.modelMessage = advancedMessage[count]
      const countUp = () => {
        this.advancedText[count].check = 'done'
        if (sound == 1) {
          if (count != 4) {
            const nextPlay = new Audio("./static/sound/sound_effect/nextPlay.mp3")
            nextPlay.play()
          }
        }
        console.log(count++);
        this.animationFlag += 1
        this.modelMessage = advancedMessage[count]
      }
      const intervalId = setInterval(() =>{
        countUp();
        if(count > 4){　
          clearInterval(intervalId);
          if (sound == 1) {
            const end_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_07.wav")
            end_voice.play()
          }
          this.animationFlag = 10
          this.hanamaru = true
          this.faceShowToggle = false
          this.cameraChangeToggle = false
      }}, 10000);
    },
    trainingStart: function () {
      var sound = document.getElementById('vueSound').value
      this.tutorialTitle = 'あいうえお体操'
      this.startBtnMessage = 'やってみる'
      if (this.tutorialCountNum == 0) {
        this.modelMessage = '準備はいいですか？'
        if (sound == 1) {
          const start_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_22.wav")
          start_voice.play()
        }
        this.tutorialCountNum += 1
        this.animationFlag = 1
      } else {
        this.modelMessage = '私のまねをしてください！'
        if (sound == 1) {
          const try_se = new Audio("./static/sound/sound_effect/try.mp3")
          try_se.play()
        }
        this.startBtn = false
        this.nextBtnArea = true
      }
    },
    replayBtn: function () {
      var sound = document.getElementById('vueSound').value
      if (sound == 1) {
        const replay = new Audio("./static/sound/sound_effect/replay.mp3")
        replay.play()
      }
      this.modelMessage = '準備はいいですか？'
      this.nextBtnArea = false
      this.startBtn = true
    },
    nextTraining: function () {
      var sound = document.getElementById('vueSound').value
      if (this.tutorialCountNum < 5) {
        if (sound == 1) {
          const nextPlay = new Audio("./static/sound/sound_effect/nextPlay.mp3")
          nextPlay.play()
        }
        this.tutorialCountNum += 1
        this.animationFlag = this.tutorialCountNum
        this.replayBtn()
        if (this.tutorialCountNum == 5) {
          this.nextBtnMessage = 'おわる'
        }
      } else {
        if (sound == 1) {
          const end_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_07.wav")
          end_voice.play()
        }
        this.animationFlag = 10
        this.tutorialCountNum = 0
        this.tutorialTitle = 'にこトレの使い方'
        this.startBtnMessage = 'はじめる'
        this.nextBtnMessage = '次へ進む'
        this.modelMessage = 'どちらのモードにしますか？'
        this.modeChoicePage = true
        this.beginnerPage = false
        this.startBtn = true
        this.nextBtnArea = false
        this.faceShowToggle = false
        this.cameraChangeToggle = false
      }
    },
    cameraChange: function () {
      console.log('change!')
      var trainingArea = document.getElementById('trainingArea')
      trainingArea.style.flexDirection = 'column-reverse'
    }
  },
  watch: {
    faceShowToggle: function () {
      var myFace = document.getElementById('container')
      if (this.faceShowToggle == true) {
        myFace.style.visibility = 'visible'
        this.cameraChangeBtn = true
      } else {
        myFace.style.visibility = 'hidden'
        this.cameraChangeBtn = false
        this.cameraChangeToggle = false
      }
    },
    cameraChangeToggle: function () {
      var trainingArea = document.getElementById('trainingArea')
      var canvas = document.getElementById('canvas')
      var video = document.getElementById('video')
      var faceCanvas = document.getElementById('faceCanvas')
      if (this.cameraChangeToggle == true) {
        trainingArea.style.flexDirection = 'column-reverse'
        canvas.style.width = (this.canvasWidth/3) + 'px'
        canvas.style.height = (this.canvasWidth / 3) * this.canvasRatio + 'px'
        video.style.width = this.canvasWidth + 'px'
        video.style.height = this.canvasWidth * this.faceCanvasRatio + 'px'
        faceCanvas.style.width = this.canvasWidth + 'px'
        faceCanvas.style.height = this.canvasWidth * this.faceCanvasRatio + 'px'
        this.modelAndDialogueFlex = 'modelAndDialogueFlex'
      } else {
        trainingArea.style.flexDirection = 'column'
        canvas.style.width = this.canvasWidth + 'px'
        canvas.style.height = this.canvasHeight + 'px'
        video.style.width = this.faceCanvasWidth + 'px'
        video.style.height = this.faceCanvasHeight + 'px'
        faceCanvas.style.width = this.faceCanvasWidth + 'px'
        faceCanvas.style.height = this.faceCanvasHeight + 'px'
        this.modelAndDialogueFlex = ''
      }
    }
  }
});
