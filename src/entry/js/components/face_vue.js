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
    modelMessage: 'どちらのモードにしますか？',
    tutorialTitle: 'にこトレの使い方',
    tutorialText: ['初心者モードでは、ミライ小町ちゃんと一緒に「あいうえお体操」のやり方を1つずつ確認しながら進めていきます。', '口を全体に大きく「あ」の形に開け、目を最大限に大きく見開き、眉毛をできるだけ上に上げます。', '口を横に大きく「い」の形に開け、顔全体を横に引っ張る意識で思い切り力を入れます。', '口をできるだけすぼめて「う」の形を作り、目はギュッと閉じ、顔のすべてのパーツを中心に集めるつもりで力を入れます。', '口を横に大きく「え」の形に開け、目は大きく見開き、口角を引き上げた位置でキープします。', '口を縦に大きく「お」の形に開け、目は驚いたときのように大きく見開き、顔全体を縦に引っ張る意識で力を入れます。'],
    advancedText: [
      { id: '0', text: '・「あ」', check: 'done' },
      { id: '1', text: '・「い」', check: '' },
      { id: '2', text: '・「う」', check: '' },
      { id: '3', text: '・「え」', check: '' },
      { id: '4', text: '・「お」', check: '' }
    ],
    tutorialCountNum: 0,
    startBtnMessage: 'はじめる',
    nextBtnMessage: '次へ進む',
    toggle: false,
    animationFlag: -5 //ページの初期番号 camera位置修正に使う
  },
  methods: {
    beginnerMode: function () {
      this.modelMessage = 'さっそく始めましょう！'
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
          this.animationFlag = 10
          end_voice.play()

        }
        this.tutorialCountNum = 0
        this.tutorialTitle = 'にこトレの使い方'
        this.startBtnMessage = 'はじめる'
        this.nextBtnMessage = '次へ進む'
        this.modelMessage = 'どちらのモードにしますか？'
        this.modeChoicePage = true
        this.beginnerPage = false
        this.startBtn = true
        this.nextBtnArea = false
        this.toggle = false
      }
    }
  },
  watch: {
    toggle: function () {
      var myFace = document.getElementById('container')
      if (this.toggle == true) {
        myFace.style.visibility = 'visible'
      } else {
        myFace.style.visibility = 'hidden'
      }
    }
  }
});
