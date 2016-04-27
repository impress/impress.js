// `arraify` takes an array-like object and turns it into real Array
// to make all the Array.prototype goodness available.
export function arrayify(a) {
  return [].slice.call(a);
};

// `toNumber` takes a value given as `numeric` parameter and tries to turn
// it into a number. If it is not possible it returns 0 (or other value
// given as `fallback`).
export function toNumber( numeric, fallback ) {
  return isNaN( numeric ) ? ( fallback || 0 ) : Number( numeric );
};
