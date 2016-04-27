import {
  toNumber,
  arrayify,
  translate,
  rotate,
  scale,
  perspective
} from './transformer'

describe('Transformers', () => {

  describe('arrayify', () => {
    it('should convert an array-like object into an array', () => {
      expect(arrayify('foo')).toEqual(['f', 'o', 'o']);
      (function() {
        expect(arrayify(arguments)).toEqual(['foo', 'bar']);
      })('foo', 'bar');
    });
  });

  describe('toNumber', () => {
    it('should convert a string to a number or zero', () => {
      expect(toNumber('5')).toEqual(5);
      expect(toNumber(null)).toEqual(0);
      expect(toNumber()).toEqual(0);
    });

    it('should convert a string to a default number', () => {
      expect(toNumber(undefined, 123)).toEqual(123);
      expect(toNumber('abc', 123)).toEqual(123);
    });
  });

  describe('translation strings', () => {
    it('should create a translate transform string from a coordinate', () => {
      expect(translate({
        x: 1,
        y: 2,
        z: 3
      })).toEqual(" translate3d(1px,2px,3px) ");
    });

    it('should create a scale transform string from a value', () => {
      expect(scale(5)).toEqual(" scale(5) ");
    });

    it('should create a perspective transform string from a value', () => {
      expect(perspective(5)).toEqual(" perspective(5px) ");
    });
  });

});
