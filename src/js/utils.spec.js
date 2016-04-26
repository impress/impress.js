import {
  toNumber,
  arrayify
} from './utils'

describe('Utils', function() {

  it('should convert arguments to array', function() {
    expect(arrayify('foo')).toEqual(['f', 'o', 'o']);
  });

  it('should convert a string to a number', function() {
    expect(toNumber('5')).toEqual(5);
    expect(toNumber(null)).toEqual(0);
    expect(toNumber()).toEqual(0);
    expect(toNumber('abc', 123)).toEqual(123);
  });
});
