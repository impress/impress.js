var Result = function () {
  var startTime = Date.now()

  this.total = this.skipped = this.failed = this.success = 0
  this.netTime = this.totalTime = 0
  this.disconnected = this.error = false

  this.totalTimeEnd = function () {
    this.totalTime = Date.now() - startTime
  }

  this.add = function (result) {
    if (result.skipped) {
      this.skipped++
    } else if (result.success) {
      this.success++
    } else {
      this.failed++
    }

    this.netTime += result.time
  }
}

module.exports = Result
