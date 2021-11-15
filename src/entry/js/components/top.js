const top = new Vue({
  el: '#mainArea',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    selected: 'Japanese'
  },
  methods: {
    localStorageRemove: function () {
      var result = window.confirm('本当にスタンプカードをリセットしてもよろしいですか？');
      if( result ) {
        localStorage.removeItem('key')
        console.log('localStorageRemove!')
      }
    },
    hello: function () {
      const helloVoice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_01.wav");
      var soundCheck = document.getElementById("sound").checked
      if (soundCheck == true) {
        helloVoice.play();
      }
    }
  },
  watch: {
    selected: function () {
      console.log(this.selected)
    }
  }
});
