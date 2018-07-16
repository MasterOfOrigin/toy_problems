/*
Project Euler Problem #78

Let p(n) represent the number of different ways in which n coins can be separated into piles. For example, five coins can be separated into piles in exactly seven different ways, so p(5)=7.

OOOOO
OOOO   O
OOO   OO
OOO   O   O
OO   OO   O
OO   O   O   O
O   O   O   O   O
Find the least value of n for which p(n) is divisible by one million.

*/

module.exports = (limit) => {
  for (var n = 1; n <= limit; n++) {
    if (p(n)%1000000 === 0)
      return n
  }
}

function numPilesWithoutOne(n, max) {
  if (n <= 3) {
    if (n < 2)
      return 0
    else
      return 1
  }
  count = 1
  var i = n - 2
  while (i >= 2) {
    if (n-i < n) {
      count += numPilesWithoutOne(n-i, n - (n-i))
    } else {
    }
    i--
  }
  return count
}



function numPilesWithoutOne(n) {
  function recurse(n) {
    if (n < 2)
      return 0
    else if (n === 2 || n === 3)
      return 1
    else
      return
  }
  return recurse(n)
}

function getNewPilesWithoutOne(piles, count) {
  for (var idx = piles.length-1; idx > 0; idx--) {
    if (piles[idx] > 3) {
      if (idx !== piles.length-1) {
        return piles.slice(0, idx).concat([piles[idx] -1, sum(...piles.slice(idx+1))]
      } else {
        return piles.slice(0, idx).concat([piles[idx] - 2, 2])
      }
    }
  }
}

function getNewPilesTailWithoutOne(head, remainder) {
  var result = [head]
  while (remainder > head) {
    result.push(head)
    remainder -= tailHeadVal
  }
  if (remainder)
    result.push(remainder)
  return result
}


function getPilesTail(tail) {
  var tailHeadVal = tail[0] -1
  var remainder = sum(1, ...tail.slice(1))
  var result = [tailHeadVal]
  while (remainder > tailHeadVal) {
    result.push(tailHeadVal)
    remainder -= tailHeadVal
  }
  if (remainder)
    result.push(remainder)
  return result
}



function p(n) {
  var piles = [n]
  var count = 1
  console.log("n: ", n)
  console.log(count, " piles: ", piles)
  while (piles[0] !== 1) {
    piles = getNewPiles(piles)
    count++
    console.log(count, " piles: ", piles)
  }
  console.log("count: ", count, "\n\n\n")
  return count
}

function getNewPiles(piles) {
  for (var idx = piles.length-1; idx >= 0; idx--) {
    if (piles[idx] > 1) {
      // return piles.slice(0, idx).concat([ piles[idx]-1, sum(1, ...piles.slice(idx+1))])
      return piles.slice(0, idx).concat(getPilesTail(piles.slice(idx)))

    }
  }
}

function sum(...args) {
  var result = 0
  for (var i = 0; i < args.length; i++) {
    result += args[i]
  }
  return result
}

function getPilesTail(tail) {
  var tailHeadVal = tail[0] -1
  var remainder = sum(1, ...tail.slice(1))
  var result = [tailHeadVal]
  while (remainder > tailHeadVal) {
    result.push(tailHeadVal)
    remainder -= tailHeadVal
  }
  if (remainder)
    result.push(remainder)
  return result
}
