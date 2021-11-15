const helloVoice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_01.wav");

document.getElementById("sound").onclick = function () {
  var soundCheck = document.getElementById("sound").checked
  if (soundCheck == true) {
    helloVoice.play();
  }
}

const top = new Vue({
  el: '#mainArea',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
  },
  methods: {
    localStorageRemove: function () {
      localStorage.removeItem('key')
      console.log('localStorageRemove!')
    }
  }
});
