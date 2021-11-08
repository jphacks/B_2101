console.log(localStorage)

if (localStorage.length == 1) {
  console.log(localStorage.getItem('key'))
}

document.getElementById("test").onclick = function test() {
  if (localStorage.length == 0) {
    localStorage.setItem('key', 1)
    console.log('localStorage create!')
  } else {
    var value = localStorage.getItem('key')
    var int = parseInt(value)
    console.log(int)
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
