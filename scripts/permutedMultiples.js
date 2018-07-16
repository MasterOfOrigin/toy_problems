//SOLVED

/*
Permuted Multiples

PROJECT EULER: PROBLEM #52

It can be seen that the number, 125874, and its double, 251748, contain exactly the same digits, but in a different order.

Find the smallest positive integer, x, such that 2x, 3x, 4x, 5x, and 6x, contain the same digits.

COMPLETED!!
*/


module.exports = (N) => {
  var i = 100000
  var digits, num, d, N, result
  while (i < 10000000) {
    digits = {}
    num = i
    while (num > 0) {
      d = num%10
      digits[d] = (digits[d] || 0) + 1
      num = Math.floor(num/10)
    }
    if (d !== 1) {
      i = i*10
    } else {
      var n = 1
      result = true
      while (result && ++n <= N) {
        result = hasDigits((n*i), digits)
      }
      if (result)
        return i
    }
    i++
  }
}

function getDigits(num) {
  var result = {}
  var d;
  while (num > 0) {
    d = num%10
    result[d] = (result[d] || 0) + 1
    num = Math.floor(num/10)
  }
  return result
}

function hasDigits(num, digitsObj) {
  var count = {};
  while (num > 0) {
    d = num%10
    count[d] = (count[d] || 0) + 1
    if (!digitsObj[d] || count[d] > digitsObj[d])
      return false
    num = Math.floor(num/10)
  }
  return true
}
