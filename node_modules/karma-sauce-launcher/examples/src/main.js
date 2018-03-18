;(function () {
  window.add = function (num1, num2) {
    return num1 + num2
  }
  window.subtract = function (num1, num2) {
    return num1 - num2
  }
  window.updateAppState = function (state) {
    window.history.pushState(state || {}, document.title, 'newstate')
  }
})()
