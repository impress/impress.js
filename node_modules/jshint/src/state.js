"use strict";
var NameStack = require("./name-stack.js");

var state = {
  syntax: {},

  /**
   * Determine if the code currently being linted is strict mode code.
   *
   * @returns {boolean}
   */
  isStrict: function() {
    return this.directive["use strict"] || this.inClassBody ||
      this.option.module || this.option.strict === "implied";
  },

  // Assumption: chronologically ES3 < ES5 < ES6 < Moz

  inMoz: function() {
    return this.option.moz;
  },

  /**
   * @param {boolean} strict - When `true`, only consider ES6 when in
   *                           "esversion: 6" code.
   */
  inES6: function(strict) {
    if (strict) {
      return this.esVersion === 6;
    }
    return this.option.moz || this.esVersion >= 6;
  },

  /**
   * @param {boolean} strict - When `true`, return `true` only when
   *                           esVersion is exactly 5
   */
  inES5: function(strict) {
    if (strict) {
      return (!this.esVersion || this.esVersion === 5) && !this.option.moz;
    }
    return !this.esVersion || this.esVersion >= 5 || this.option.moz;
  },

  /**
   * Determine the current version of the input language by inspecting the
   * value of all ECMAScript-version-related options. This logic is necessary
   * to ensure compatibility with deprecated options `es3`, `es5`, and
   * `esnext`, and it may be drastically simplified when those options are
   * removed.
   *
   * @returns {string|null} - the name of any incompatible option detected,
   *                          `null` otherwise
   */
  inferEsVersion: function() {
    var badOpt = null;

    if (this.option.esversion) {
      if (this.option.es3) {
        badOpt = "es3";
      } else if (this.option.es5) {
        badOpt = "es5";
      } else if (this.option.esnext) {
        badOpt = "esnext";
      }

      if (badOpt) {
        return badOpt;
      }

      this.esVersion = this.option.esversion;
    } else if (this.option.es3) {
      this.esVersion = 3;
    } else if (this.option.esnext) {
      this.esVersion = 6;
    }

    return null;
  },

  reset: function() {
    this.tokens = {
      prev: null,
      next: null,
      curr: null
    };

    this.option = {};
    this.esVersion = 5;
    this.funct = null;
    this.ignored = {};
    this.directive = {};
    this.jsonMode = false;
    this.jsonWarnings = [];
    this.lines = [];
    this.tab = "";
    this.cache = {}; // Node.JS doesn't have Map. Sniff.
    this.ignoredLines = {};
    this.forinifcheckneeded = false;
    this.nameStack = new NameStack();
    this.inClassBody = false;
  }
};

exports.state = state;
