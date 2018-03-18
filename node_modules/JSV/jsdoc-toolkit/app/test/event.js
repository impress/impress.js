/**
 * @name Kitchen
 * @constructor
 * @fires Bakery#event:donutOrdered
 */

/**
 * Fired when some cake is eaten.
 * @name Kitchen#event:cakeEaten
 * @function
 * @param {Number} pieces The number of pieces eaten.
 */

/**
 * Find out if cake was eaten.
 * @name Kitchen#cakeEaten
 * @function
 * @param {Boolean} wasEaten
 */

/**
 * @name getDesert
 * @function
 * @fires Kitchen#event:cakeEaten
 */
 
/**
 * @name Bakery
 * @constructor
 * @extends Kitchen
 */

/**
 * Fired when a donut order is made.
 * @name Bakery#event:donutOrdered
 * @event
 * @param {Event} e The event object.
 * @param {String} [e.topping] Optional sprinkles.
 */

/**
 * @constructor
 * @borrows Bakery#event:donutOrdered as this.event:cakeOrdered
 */
function CakeShop() {
}

/** @event */
CakeShop.prototype.icingReady = function(isPink) {
}

/** @event */
function amHungry(/**Boolean*/enoughToEatAHorse) {
}