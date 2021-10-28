const face = new Vue({
  el: '#face',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    modeChoicePage: true,
    beginnerPage: false,
    advancedPage: false,
    modelMessage: 'こんにちは！',
    tutorialText: ['口を全体に大きく「あ」の形に開け、目を最大限に大きく見開き、眉毛をできるだけ上に上げます。', '口を横に大きく「い」の形に開け、顔全体を横に引っ張る意識で思い切り力を入れます。', '口をできるだけすぼめて「う」の形を作り、目はギュッと閉じ、顔のすべてのパーツを中心に集めるつもりで力を入れます。', '口を横に大きく「え」の形に開け、目は大きく見開き、口角を引き上げた位置でキープします。', '口を縦に大きく「お」の形に開け、目は驚いたときのように大きく見開き、顔全体を縦に引っ張る意識で力を入れます。'],
    tutorialCountNum: 0
  },
  methods: {
    beginnerMode: function () {
      this.modeChoicePage=false
      this.beginnerPage=true
    },
    advancedMode: function () {
      this.modeChoicePage=false
      this.advancedPage=true
    },
    nextTraining: function () {
      if (this.tutorialCountNum < 4) {
        this.tutorialCountNum += 1
      } else {
        this.tutorialCountNum = 0
        this.modeChoicePage=true
        this.beginnerPage=false
      }
    }
  }
});
