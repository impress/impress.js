module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['mocha'],

    files: [
      '*.js'
    ],

    exclude: [],

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: false,

    plugins: [
      require('../../'),
      'karma-mocha'
    ]
  })
}
