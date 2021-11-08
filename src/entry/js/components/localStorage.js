console.log(localStorage)
//console.log(localStorage.length)

if (localStorage.length == 1) {
  console.log(localStorage.getItem('key'))
}

// localStorageをリセットする（デバッグ用）
//localStorage.removeItem('key')

document.getElementById("test").onclick = function test() {
  if (localStorage.length == 0) {
    localStorage.setItem('key', 1)
    console.log('localStorage create!')
  } else {
    var value = localStorage.getItem('key')
    //console.log(value)
    //console.log(typeof value)
    var int = parseInt(value)
    console.log(int)
    //console.log(typeof int)
    int += 1
    localStorage.removeItem('key')
    localStorage.setItem('key', int)
    value = localStorage.getItem('key')
    console.log(value)
  }
}

document.getElementById("test2").onclick = function reset() {
  localStorage.removeItem('key')
}
