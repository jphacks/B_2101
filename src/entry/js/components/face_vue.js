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
    modelMessage: 'こんにちは！',
    tutorialText: ['口を全体に大きく「あ」の形に開け、目を最大限に大きく見開き、眉毛をできるだけ上に上げます。', '口を横に大きく「い」の形に開け、顔全体を横に引っ張る意識で思い切り力を入れます。', '口をできるだけすぼめて「う」の形を作り、目はギュッと閉じ、顔のすべてのパーツを中心に集めるつもりで力を入れます。', '口を横に大きく「え」の形に開け、目は大きく見開き、口角を引き上げた位置でキープします。', '口を縦に大きく「お」の形に開け、目は驚いたときのように大きく見開き、顔全体を縦に引っ張る意識で力を入れます。'],
    advancedText: [
      { id: '0', text: '・「あ」', check: 'done' },
      { id: '1', text: '・「い」', check: '' },
      { id: '2', text: '・「う」', check: '' },
      { id: '3', text: '・「え」', check: '' },
      { id: '4', text: '・「お」', check: '' }
    ],
    tutorialCountNum: 0,
    nextBtnMessage: '次へ進む',
    animationFlag: -5 //ページの初期番号 camera位置修正に使う
  },
  methods: {
    beginnerMode: function () {
      this.modeChoicePage=false
      this.beginnerPage = true
    },
    advancedMode: function () {
      this.modeChoicePage=false
      this.advancedPage=true
    },
    trainingStart: function () {
      this.startBtn = false
      this.nextBtnArea = true
      this.animationFlag = 1 //進んだら一に戻す
    },
    replayBtn: function () {
      this.nextBtnArea = false
      this.startBtn = true
      //this.animationFlag = -1 //戻ったらマイナス－1
    },
    nextTraining: function () {
      if (this.tutorialCountNum < 4) {
        this.tutorialCountNum += 1
        this.replayBtn()
        if (this.tutorialCountNum == 4) {
          this.nextBtnMessage = 'おわる'
        }
      } else {
        this.tutorialCountNum = 0
        this.nextBtnMessage = '次へ進む'
        this.modeChoicePage = true
        this.beginnerPage =false
      }
    }
  }
});
