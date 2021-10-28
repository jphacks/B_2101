const face = new Vue({
  el: '#face',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    modeChoicePage: true,
    beginnerPage: false,
    advancedPage: false,
    modelMessage: 'こんにちは！'
  },
  methods: {
    beginnerMode: function () {
      this.modeChoicePage=false
      this.beginnerPage=true
    },
    advancedMode: function () {
      this.modeChoicePage=false
      this.advancedPage=true
    }
  }
});
