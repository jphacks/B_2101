window.onload = function () {
  var openingElement = document.getElementById('openingContents');

  $(openingElement).addClass('is-fadein');

  //setTimeout(fadeout, 2000);
}

function fadeout() {
  $('#opening').fadeOut('slow');
}
