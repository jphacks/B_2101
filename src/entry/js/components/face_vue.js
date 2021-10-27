const face = new Vue({
  el: '#face',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    modeChoicePage: true,
    tutorialPage: false,
  },
  methods: {
    beginnerMode: function () {
      this.modeChoicePage=false
      this.tutorialPage=true
    }
  }
});
