var COLORS_ON = {
  RESET: '\x1B[39m',
  ANSWER: '\x1B[36m', // NYAN
  SUCCESS: '\x1B[32m', // GREEN
  QUESTION: '\x1B[1m', // BOLD
  question: function (str) {
    return this.QUESTION + str + '\x1B[22m'
  },
  success: function (str) {
    return this.SUCCESS + str + this.RESET
  }
}

var COLORS_OFF = {
  RESET: '',
  ANSWER: '',
  SUCCESS: '',
  QUESTION: '',
  question: function (str) {
    return str
  },
  success: function (str) {
    return str
  }
}

exports.ON = COLORS_ON
exports.OFF = COLORS_OFF
