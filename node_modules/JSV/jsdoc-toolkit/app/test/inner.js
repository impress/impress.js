/**
 * @constructor
 */
function Outer() {
  /**
   * @constructor
   */
  function Inner(name) {
    /** The name of this. */
    this.name = name;
  }

  this.open = function(name) {
    return (new Inner(name));
  }
}