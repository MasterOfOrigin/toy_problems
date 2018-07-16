/*
//PROJECT EULER PROBLEM 504

Let ABCD be a quadrilateral whose vertices are lattice points lying on the coordinate axes as follows:

A(a, 0), B(0, b), C(−c, 0), D(0, −d), where 1 ≤ a, b, c, d ≤ m and a, b, c, d, m are integers.

It can be shown that for m = 4 there are exactly 256 valid ways to construct ABCD. Of these 256 quadrilaterals, 42 of them strictly contain a square number of lattice points.

How many quadrilaterals ABCD strictly contain a square number of lattice points for m = 100?
*/
var iters = 0;
module.exports = (m) => {
  var a = b = c = d = 1;
  var result = 0;
  var args = [a, b, c, d]
  while (args) {
    result += getInteriorLatticePoints(args)
    args = getNext(args, m)
  }
  return result
}
// new method idea: get slope, if slope is A/B where A and B are both integers with GCD of 1, num little triangles of area AB/2, will be equal to area of big trianlge divided by little triangles. Each vertex of little trianlge will be a lattice point.

function isPerfectSquare(n) {
  let sqrt = n**0.5
  return sqrt%1 === 0
}

function getNext(args, m) {
  for (var i = 0; i < args.length; i++) {
    if (args[i] < m) {
      args[i]++
      // return args.map(function(val, idx, args) { return idx < i ? args[idx+2] ? args[idx+2] : 1 : val })
      return args.map(function(val, idx, args) { return idx < i ? 1 : val })
    }
  }
  return false
}



function gcdEuclid(a, b) {
  if (b > a) {
    let x = a
    a = b
    b = x
  }
  var r = a%b
  while (r > 0) {
    a = b
    b = r
    r = a%b
  }
  return b
}

var cacheInteriorPtsLineSeg = {}
// a must be greater than or equal to b
function getNumInteriorPtsLineSeg(constA, constB) {
  // console.log("constA: ", constA, "constB: ", constB)
  function recurse(a, b) {
    let cacheVal = cacheInteriorPtsLineSeg[[a, b]]
    if (cacheVal) {
      let bFraction = constB/b
      return bFraction*cacheVal + (bFraction - 1)
    }

    let gcd = gcdEuclid(a, b)
    if (gcd === 1) {
      let result = constB/b - 1
      cacheInteriorPtsLineSeg[[constA, constB]] = result
      return result
    }
    return recurse(a/gcd, b/gcd)
  }
  if (constB > constA) {
    let x = constA
    constA = constB
    constB = x
  }
  return recurse(constA, constB)
}

function getInteriorLatticePoints(args) {
  var numResults;
  var a,b,c,d
  if (args[0] === args[1] && args[1] === args[2] && args[2] === args[3]) {
    [a,b,c,d] = args
    numResults = 1
  } else {
    if (args[0] !== args[2] || args[1] !== args[3]) {
      let max = Math.max(...args)
      var anchorIdx;
      if (hasMultiple(args, max)) {
        anchorIdx = secondMaxIdx(args, max)
      } else {
        anchorIdx = args.indexOf(max)
      }
      if (anchorIdx === 0)
         [a,b,c,d] = args
      else
        [a,b,c,d] = args.slice(anchorIdx).concat(args.slice(0, anchorIdx))
      numResults = 4
    } else {
      if (args[0] > args[1])
        [a,b,c,d] = args
      else
        [b,c,d,a] = args
      numResults = 2
    }
  }

  var cacheVal = cacheInteriorPtsPolygon[[a, b, c, d]]
  if (cacheVal)
    return 0

  return hasSquareInteriorPtsPolygon(a,b,c,d) ? numResults : 0
}

function hasMultiple(arr, n) {
  let count = 0
  for (let val of arr) {
    if (val === n) {
      if (++count > 1)
        return true
    }
  }
  return false
}

function secondMaxIdx(arr, max) {
  var max2 = 0
  var result;
  arr.forEach((val, idx) => {
    if (val !== max && val > max2) {
      max2 = val
      result = idx
    }
  })
  return result
}


var cacheInteriorPtsPolygon = {}
// Pick's theorem: A = I + 1/2(B) - 1.   {A: 'area', I: 'Interior Lattice Pts', B: 'Boundary Lattice Pts'}
function hasSquareInteriorPtsPolygon(a, b, c, d) {

  let result = getArea(a,b,c,d) - getBoundaryPts(a,b,c,d)/2 + 1

  // let numRotations = getAddRotations(result, a, b, c, d)
  cacheInteriorPtsPolygon[[a, b, c, d]] = result
  if (isPerfectSquare(result))
    return true

  return false
}

function getBoundaryPts(a, b, c, d) {
  var result = 4
  for (var i = 0; i < 4; i++) {
    result += getNumInteriorPtsLineSeg(arguments[i], arguments[(i+1) < 4 ? i+1: 0])
  }
  return result
}
function getArea(a, b, c, d) {
  return ((a*b)/2) + ((b*c)/2) + ((c*d)/2) + ((d*a)/2)
}


function getAddRotations(result, a, b, c, d) {
  cacheInteriorPtsPolygon[[a, b, c, d]] = result
  if (a === b && b === c && c === d)
    return 1
  else {
    cacheInteriorPtsPolygon[[b, c, d, a]] = result
    if (a !== c || b !== d) {
      cacheInteriorPtsPolygon[[c, d, a, b]] = result
      cacheInteriorPtsPolygon[[d, a, b, c]] = result
      return 4
    }
    return 2
  }
}










/*

function calcNumResults(a1, b1, c1, d1, result1, m) {
  let numResults = 0
  function recurse(a, b, c, d, result) {
    if (a > m || b  > m || c > m || d > m)
      return numResults

    let numRotations = getAddRotations(result, a, b, c, d)
    if (isPerfectSquare(result))
      return numRotations
    else {
      return 0
    }
      // numResults += numRotations

    return recurse(a+1, b+1, c+1, d+1, getArea(a,b,c,d))
  }
  return recurse(a1, b1, c1, d1, result1)
}



function getBoundaryPtsTriangle(a, b) {
  return {
    A: a*b/2,
    B: getNumInteriorPtsLineSeg(a, b)
  }
}

function sumMerge(obj1, obj2) {
  for (var key in obj2)
    obj1[key] += obj2[key]
}


function checkPolygonCache(next, a, b, c, d) {
  var cacheVal = cacheInteriorPtsPolygon[[a, b, c, d]]
  if (cacheVal) {
    return cacheVal
  }
  return next(b, c, d, a)
}


function getPrimes(ceil) {
  var primes = [2]
  var isPrime;
  for (var i = 3; i <= ceil; i+= 2) {
    isPrime = true
    for (var p of primes) {
      i%p === 0 ? isPrime = false : null
      if (!isPrime || p > i**0.5)
      continue
    }
    isPrime && primes.push(i)
  }
  return primes
}


const containsLogSearch = (sortedArr, n) => {
  var floor = 0, ceil = sortedArr.length, midIdx, mid
  while (ceil >= floor) {
    midIdx = Math.floor(floor + (ceil - floor)/2)
    mid = sortedArr[midIdx]
    if (n < mid) {
      ceil = midIdx - 1
    } else if (n > mid) {
      floor = midIdx + 1
    } else {
      return true
    }
  }
  return false
}
*/
