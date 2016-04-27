export function arrayify(a) {
  return [].slice.call(a);
};

export function toNumber(numeric, fallback) {
  return isNaN(numeric) ? (fallback || 0) : Number(numeric);
};

export function translate(t) {
  return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
};

// `rotate` builds a rotate transform string for given data.
// By default the rotations are in X Y Z order that can be reverted by passing `true`
// as second parameter.
export function rotate(r, revert) {
  let rX = " rotateX(" + r.x + "deg) ",
    rY = " rotateY(" + r.y + "deg) ",
    rZ = " rotateZ(" + r.z + "deg) ";

  return revert ? rZ + rY + rX : rX + rY + rZ;
};

export function scale(s) {
  return " scale(" + s + ") ";
};

export function perspective(p) {
  return " perspective(" + p + "px) ";
};
