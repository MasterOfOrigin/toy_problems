//SOLVED

/*
PROJECT EULER: PROBLEM 51

By replacing the 1st digit of the 2-digit number *3, it turns out that six of the nine possible values: 13, 23, 43, 53, 73, and 83, are all prime.

By replacing the 3rd and 4th digits of 56**3 with the same digit, this 5-digit number is the first example having seven primes among the ten generated numbers, yielding the family: 56003, 56113, 56333, 56443, 56663, 56773, and 56993. Consequently 56003, being the first member of this family, is the smallest prime with this property.

Find the smallest prime which, by replacing part of the number (not necessarily adjacent digits) with the same digit, is part of an eight prime value family.

COMPLETED!!
*/

module.exports = () => {
  const primes = [2,3,5,7]
  var skips = []
  var i = 9
  for (var i = 9; i < 1000000; i+= 2) {
    var skipsIdx = skips.indexOf(i)
    if (skipsIdx > 0)
      skips = skips.slice(skipsIdx + 1)
    else {
      var factor = appendPrimes(i, primes)
      if (factor)
        skips.push(factor*2 + i, factor*4 + i)
    }
  }

  var prime1, prime2, familiesObj, newFamilies, families
  for (var prime1Idx = 0; prime1Idx < primes.length; prime1Idx++) {
    familiesObj = {}
    prime1 = primes[prime1Idx]
    if (prime1 > 10000) {
      for (var prime2Idx = prime1Idx+1; prime2Idx < primes.length; prime2Idx++) {
        prime2 = primes[prime2Idx]
        newFamily = getFamily(prime1, prime2)
        if (newFamily) {
          families = familiesObj[newFamily] = familiesObj[newFamily] || []
          families.push(prime2)
          if (families.length >= 6)
            console.log(newFamily, [prime1].concat(families))
          if (families.length >= 7)
            return {
              family: newFamily,
              primes: [prime1].concat(families)
            }
        }
      }
    }
  }
}

const appendPrimes = (n, primes) => {
  var i = 0
  var factor = primes[i]
  while (factor <= n**0.5) {
    if (n%factor === 0)
      return factor
    factor = primes[++i]
  }
  primes.push(n)
  return false
}

const logSearch = (sortedArr, n) => {
  var floor = 0, ceil = sortedArr.length, midIdx, mid
  while (ceil >= floor) {
    midIdx = Math.floor(floor + (ceil - floor)/2)
    mid = sortedArr[midIdx]
    if (n < mid) {
      ceil = midIdx - 1
    } else if (n > mid) {
      floor = midIdx + 1
    } else {
      return midIdx
    }
  }
  return -1
}

const isSorted = (arr) => {
  for (var i = 1; i < arr.length; i++) {
    if (arr[i-1] > arr[i])
      return false
  }
  return true
}

// var getFamiles = (prime1) => {
//   const primeStr = String(prime1)
//   var family = '', families = [], numBlanks = 1, maxBlanks = 0; counts = {}; char;
//   for (var i = 0; i < primeStr.length; i++) {
//     char = primeStr[i]
//     counts[char] = counts[char] ? counts[char] + 1 : 1
//   }
//   for (var i = 0; i < primeStr.length; i++) {
//     char = primeStr[i]
//     counts[char] = counts[char] ? counts[char] + 1 : 1
//   }
// }

var getFamily = (prime1, prime2) => {
  prime1 = String(prime1)
  prime2 = String(prime2)
  var fam = '', differences1 = [], differences2 = [], prime1Char, prime2Char
  if (prime1.length === prime2.length) {
    for (var idx = 0; idx < prime1.length; idx++) {
      prime1Char = prime1[idx]
      prime2Char = prime2[idx]
      if (prime1Char === prime2Char) {
        fam += prime1Char
      } else if ((differences1[0] === undefined || differences1[0] === prime1Char) && (differences2[0] === undefined || differences2[0] === prime2Char)) {
        fam += '*'
        differences1.push(prime1Char)
        differences2.push(prime2Char)
      } else {
        return false
      }
    }
    return fam
  }
  return false
}
