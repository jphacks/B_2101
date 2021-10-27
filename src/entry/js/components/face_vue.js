const face = new Vue({
  el: '#face',
  // FlaskとVueを共存させるためにDelimiterを変更する
  delimiters: ["[[", "]]"],
  data: {
    testMessage: 'Hello Vue!!',
  }
});
