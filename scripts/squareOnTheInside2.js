/*
//PROJECT EULER PROBLEM 504

Let ABCD be a quadrilateral whose vertices are lattice points lying on the coordinate axes as follows:

A(a, 0), B(0, b), C(−c, 0), D(0, −d), where 1 ≤ a, b, c, d ≤ m and a, b, c, d, m are integers.

It can be shown that for m = 4 there are exactly 256 valid ways to construct ABCD. Of these 256 quadrilaterals, 42 of them strictly contain a square number of lattice points.

How many quadrilaterals ABCD strictly contain a square number of lattice points for m = 100?
*/
var completeCache = {};
module.exports = (m) => {
  var result = 0;
  var args = [1, 1, 1, 1];
  var squares = getPossibleSquares(m)
  var borders, interiors, cacheVal
  while (args) {
    borders = getBorders(args)
    interiors = getInteriorLatticePts(args, borders)
    if (isPerfectSquare(interiors)) {
      cacheVal = completeCache[args]
      if (cacheVal) {
        console.log("repeated args ")
        console.log(args)
        console.log('repeated args interiors: ', interiors)
      } else {
        console.log(args)
        console.log('interiors: ', interiors)
        // result += getNumRotations(args)
        result += getNumRotations(args)
      }
    }
    populateCache(args, interiors)
    args = getNext(args, m)
  }
  return result
}

function getNumRotations(args) {
  if (args[0] === args[1] && args[1] === args[2] && args[2] === args[3])
    return 1
  else {
    if (args[0] !== args[2] || args[1] !== args[3]) {
      return 4
    } else {
      return 2
    }
  }
}

function populateCache(args, val) {
  completeCache[args] = val
  if (args[0] === args[1] && args[1] === args[2] && args[2] === args[3])
    return
  else {
    completeCache[args.slice(2).concat(args.slice(0,2))] = val
    if (args[0] !== args[2] || args[1] !== args[3]) {
      completeCache[args.slice(1).concat(args.slice(0,1))] = val
      completeCache[args.slice(3).concat(args.slice(0,3))] = val
    }
  }
}

function getBorders(args) {
  return [
    getBorderLattices(args[0], args[1]),
    getBorderLattices(args[1], args[2]),
    getBorderLattices(args[2], args[3]),
    getBorderLattices(args[3], args[0])
  ]
}

function getBorderLattices(a, b) {
  return gcdEuclid(a, b) + 1
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
      return  args.map(function(val, idx, args) { return idx < i ? idx === 0 ? Math.max(...args.slice(1)) : 1 : val })
      // return args.map(function(val, idx, args) { return idx < i ? 1 : val })
    }
  }
  return false
}

function getInteriorLatticePts(args, borders) {
  return getArea(args) - (sumArr(borders)-4)/2 + 1
}


function getArea(args) {
  return args.reduce((acc, val, idx) => {
    return acc + (val * args[idx < 3 ? idx+1 : 0])/2
  }, 0)
}

function sumArr(arr) {
  return arr.reduce((acc, v) => acc+v, 0)
}

function getPossibleSquares(m) {
  var args = [m,m,m,m]
  var borders = getBorders(args)
  var ceil = getInteriorLatticePts(args, borders)
  var squares = []
  for (var n = 1; n <= ceil; n++) {
    squares.push(n**2)
  }
  return squares
}

/*
 Pick's theorem: A = I + 1/2(B) - 1.   {A: 'area', I: 'Interior Lattice Pts', B: 'Boundary Lattice Pts'}.  I = A - 1/2B + 1

  given I = 4, get possible A's and B's  4 = A -1/2B + 1
  A = 5,
  B = 4

  A =
  B = 5




*/









































/*
function getInteriors(m, args, borders, interiors, targetIdx) {
  if (args[targetIdx] < m) {
    console.log('\nprevious: ')
    console.log({ args, borders, interiors, targetIdx})
    args[targetIdx]++
    let prevIdx = targetIdx === 0 ? 3 : targetIdx-1
    let nextIdx = targetIdx === 3 ? 0 : targetIdx+1
    interiors += borders[targetIdx] + borders[prevIdx] - 3
    borders[targetIdx] = getBorderLattices(args[targetIdx], args[nextIdx])
    borders[prevIdx] = getBorderLattices(args[targetIdx], args[prevIdx])
    var trueBorders = getBorders(args)
    var trueInteriors = getInteriorLatticePts(args, trueBorders)
    console.log({ args, borders, interiors, targetIdx, trueInteriors, trueBorders})
    if (interiors !== trueInteriors)
      console.log('wrong')
    else
      console.log('right')
  } else {
    if (targetIdx === 3)
      return false
    var args = getNext(args, m)
    if (!args)
      return { args }
    targetIdx = 0;
    borders = getBorders(args)
    interiors = getInteriorLatticePts(args, borders)
  }
  return {
    args,
    targetIdx,
    borders,
    interiors
  }
}






function getBoundaryPts(args) {
  var result = 0
  for (var i = 0; i < 4; i++) {
    result += getBorderLattices(args[i], args[(i < 3 ? i+1 : 0)])
  }
  return result-4
}
*/
