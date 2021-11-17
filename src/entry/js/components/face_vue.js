import { isThisTypeNode } from "typescript";
import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

const face = new Vue({
  el: '#face',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    info: null,
    language: '',
    firstDialogue: true,
    multipleTimesDialogue: false,
    modeChoicePage: true,
    beginnerPage: false,
    advancedPage: false,
    startBtn: true,
    nextBtnArea: false,
    advancedStartBtn: true,
    hanamaru: false,
    cameraChangeBtn: false,
    modelMessage: '',
    tutorialTitle: '',
    tutorialText: null,
    advancedText: [
      { id: '0', text: '・「あ」', check: '' },
      { id: '1', text: '・「い」', check: '' },
      { id: '2', text: '・「う」', check: '' },
      { id: '3', text: '・「え」', check: '' },
      { id: '4', text: '・「お」', check: '' }
    ],
    tutorialCountNum: 0,
    startBtnMessage: '',
    nextBtnMessage: '',
    faceShowToggle: false,
    cameraChangeToggle: false,
    animationFlag: -5, //ページの初期番号 camera位置修正に使う
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRatio: 0,
    faceCanvasWidth: 0,
    faceCanvasHeight: 0,
    faceCanvasRatio: 0,
    modelAndDialogueFlex: '',
    circleBtnTextBeginner: '',
    circleBtnTextAdvanced: '',
    stampCard: false,
    advancedFinish: false,
    stampCardText: ''
  },
  mounted: function () {
    this.language = document.getElementById('vueLanguage').value
    console.log(this.language)
    axios
      .get('./static/json/multilingual_face.json')
      .then(response => { this.info = response.data })
    var canvas = document.getElementById('canvas')
    this.canvasWidth = canvas.clientWidth
    this.canvasHeight = canvas.clientHeight
    this.canvasRatio = this.canvasHeight / this.canvasWidth
    var faceCanvas = document.getElementById('faceCanvas')
    this.faceCanvasWidth = faceCanvas.clientWidth
    this.faceCanvasHeight = faceCanvas.clientHeight
    this.faceCanvasRatio = this.faceCanvasHeight / this.faceCanvasWidth
  },
  methods: {
    beginnerMode: function () {
      this.firstDialogue = false
      this.multipleTimesDialogue = true
      this.modelMessage = this.info[this.language].komatiBeginnerModeChoice
      this.startBtnMessage = this.info[this.language].start
      this.tutorialText = this.info[this.language].tutorialText
      var sound = document.getElementById('vueSound').value
      if (sound == 1) {
        const cheer_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_11.wav")
        cheer_voice.play()
      }
      this.modeChoicePage=false
      this.beginnerPage = true
    },
    advancedMode: function () {
      this.firstDialogue = false
      this.multipleTimesDialogue = true
      this.modelMessage = this.info[this.language].komatiAdvancedModeChoice
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
      const advancedMessage = this.info[this.language].advancedMessage
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
          this.advancedFinish = true
          this.localStorageCount()
      }}, 10000);
    },
    advancedEnd: function () {
      // reset
      this.advancedStartBtn = true
      this.advancedFinish = false
      this.hanamaru = false
      for( let i=0; i<5; i++){
        this.advancedText[i].check = ''
      }
      this.modelMessage = this.info[this.language].stampMessage
      // show stamp card
      this.animationFlag = 6
      this.advancedPage = false
      this.stampCard = true
      this.stamp()
    },
    trainingStart: function () {
      var sound = document.getElementById('vueSound').value
      this.tutorialTitle = this.info[this.language].aiueoGymnastics
      this.startBtnMessage = this.info[this.language].try
      if (this.tutorialCountNum == 0) {
        this.modelMessage = this.info[this.language].areYouReady
        if (sound == 1) {
          const start_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_22.wav")
          start_voice.play()
        }
        this.tutorialCountNum += 1
        this.animationFlag = 1
      } else {
        this.modelMessage = this.info[this.language].imitation
        if (sound == 1) {
          const try_se = new Audio("./static/sound/sound_effect/try.mp3")
          try_se.play()
        }
        if (this.tutorialCountNum != 5) {
          this.nextBtnMessage = this.info[this.language].go2next
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
      this.modelMessage = this.info[this.language].areYouReady
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
          this.nextBtnMessage = this.info[this.language].finishText
          console.log('finish')
        }
      } else {
        if (sound == 1) {
          const end_voice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_07.wav")
          end_voice.play()
        }
        this.animationFlag = 10
        this.tutorialCountNum = 0
        this.tutorialTitle = this.info[this.language].tutorialTitle
        this.startBtnMessage = this.info[this.language].start
        this.nextBtnMessage = this.info[this.language].go2next
        this.modelMessage = this.info[this.language].stampMessage
        this.stampCard = true
        this.animationFlag = 6
        this.beginnerPage = false
        this.startBtn = true
        this.nextBtnArea = false
        this.faceShowToggle = false
        this.cameraChangeToggle = false
        this.localStorageCount()
        this.stamp()
      }
    },
    cameraChange: function () {
      console.log('change!')
      var trainingArea = document.getElementById('trainingArea')
      trainingArea.style.flexDirection = 'column-reverse'
    },
    localStorageCount: function () {
      if (localStorage.length == 0) {
        localStorage.setItem('key', 1)
        console.log('localStorage create!')
      } else {
        var value = localStorage.getItem('key')
        var int = parseInt(value)
        console.log(int)
        int += 1
        localStorage.removeItem('key')
        localStorage.setItem('key', int)
        value = localStorage.getItem('key')
        console.log(value)
      }
    },
    back2top: function () {
      this.modelMessage = this.info[this.language].komatiModeChoice
      this.stampCard = false
      this.modeChoicePage = true
      this.animationFlag = 10
    },
    stamp: function () {
      var self = this
      $(function () {
        var getVisitCount = (localStorage.getItem('key'))
        var visitCount = getVisitCount
        if (visitCount >= 10) {
          var ovar10 = visitCount % 10
          if (ovar10 != 0) {
            visitCount = ovar10
          }
          console.log(visitCount)
        }
        var sheetNum = Math.floor(getVisitCount / 10) + 1
        if (getVisitCount % 10 == 0) {
          sheetNum -= 1
        }
        self.stampCardText = self.info[self.language].stampCardText1 + sheetNum + self.info[self.language].stampCardText2 + getVisitCount + self.info[self.language].stampCardText3
        //スタンプの処理
        if($('#visit-stamp td:eq('+visitCount+') .stamp').length){ //指定のtd要素があるか判定
          //過去に訪問したぶんのスタンプを表示
          if($('#visit-stamp td:lt('+visitCount+') .stamp').length){
            $('#visit-stamp td:lt('+visitCount+') .stamp').addClass('visited');
          }
          //今回訪問したぶんのスタンプをアニメーションで表示
          setTimeout(function(){
            $('#visit-stamp td:eq('+visitCount+') .stamp')
              .css('transition','all 0.5s ease-in')
              .addClass('visited');
          },300);
        }else{
          //訪問回数がtd要素の数を超えたらすべて表示
          $('#visit-stamp td:lt('+visitCount+') .stamp').addClass('visited');
        }
      });
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
