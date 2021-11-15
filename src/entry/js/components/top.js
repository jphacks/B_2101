const helloVoice = new Audio("./static/sound/voice/Voices_miraikomachi_voice_01.wav");

document.getElementById("sound").onclick = function () {
  var soundCheck = document.getElementById("sound").checked
  if (soundCheck == true) {
    helloVoice.play();
  }
}

document.getElementById("localStorageRemove").onclick = function reset() {
  localStorage.removeItem('key')
}
