//SOLVED

/*
PROJECT EULER PROBLEM 54
In the card game poker, a hand consists of five cards and are ranked, from lowest to highest, in the following way:

High Card: Highest value card.
One Pair: Two cards of the same value.
Two Pairs: Two different pairs.
Three of a Kind: Three cards of the same value.
Straight: All cards are consecutive values.
Flush: All cards of the same suit.
Full House: Three of a kind and a pair.
Four of a Kind: Four cards of the same value.
Straight Flush: All cards are consecutive values of same suit.
Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
The cards are valued in the order:
2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace.

If two players have the same ranked hands then the rank made up of the highest value wins; for example, a pair of eights beats a pair of fives (see example 1 below). But if two ranks tie, for example, both players have a pair of queens, then highest cards in each hand are compared (see example 4 below); if the highest cards tie then the next highest cards are compared, and so on.

Consider the following five hands dealt to two players:

Hand	 	Player 1	 	Player 2	 	Winner
1	 	5H 5C 6S 7S KD
Pair of Fives
 	2C 3S 8S 8D TD
Pair of Eights
 	Player 2
2	 	5D 8C 9S JS AC
Highest card Ace
 	2C 5C 7D 8S QH
Highest card Queen
 	Player 1
3	 	2D 9C AS AH AC
Three Aces
 	3D 6D 7D TD QD
Flush with Diamonds
 	Player 2
4	 	4D 6S 9H QH QC
Pair of Queens
Highest card Nine
 	3D 6D 7H QD QS
Pair of Queens
Highest card Seven
 	Player 1
5	 	2H 2D 4C 4D 4S
Full House
With Three Fours
 	3C 3D 3S 9S 9D
Full House
with Three Threes
 	Player 1
The file, poker.txt, contains one-thousand random hands dealt to two players. Each line of the file contains ten cards (separated by a single space): the first five are Player 1's cards and the last five are Player 2's cards. You can assume that all hands are valid (no invalid characters or repeated cards), each player's hand is in no specific order, and in each hand there is a clear winner.

How many hands does Player 1 win?

*/
const fs = require('fs')
const R = require('ramda')

module.exports = () => {
  return formatPokerHands().map(doesPlayerOneWin).filter(R.identity).length
}

function tests() {
  var straightFlush5High = [ '2D', '3D', '4D', '5D', 'AD' ]
  var straightFlush10High = [ '6D', '7D', '8D', '9D', 'TD' ]
  var fullHouse2High = [ '2D', '2D', '2D', '5D', '5D' ]
  var fullHouse3High = [ '3D', '3D', '3D', '2D', '2D' ]
  var fourOFAKind = [ '3D', '3D', '3D', '3D', '2D' ]

  console.log("SHOULD BE TRUE ", doesPlayerOneWin([fullHouse3High, fullHouse2High]))
  console.log("SHOULD BE 8: ", getScoreParams(straightFlush5High).score)
  console.log("SHOULD BE 7: ", getScoreParams(fourOFAKind).score)
  console.log("SHOULD BE TRUE: ", doesPlayerOneWin([straightFlush10High, straightFlush5High]))
  // console.log("SHOULD BE TRUE: ", doesPlayerOneWin([straightFlush10High, straightFlush5High]))

}

function formatPokerHands() {
  const pokerHands = fs.readFileSync('/Users/mikemahon/Documents/toy_problems/input_files/poker.txt', { 'encoding': 'utf-8'})

  return R.pipe(
    R.split('\n'),
    R.map(R.split(' ')),
    R.filter((row) => row.length === 10),
    R.map(R.splitAt(5)),
    R.map(R.map(R.sort(cardComparator)))
  )(pokerHands)
}

function cardComparator(a, b) {
  if (typeof a === 'string')
    a = getNumericVal(a)
  if (typeof b === 'string')
    b = getNumericVal(b)
  if (a > b)
    return 1
  else if (a < b)
    return -1
  else
    return 0
}

function getNumericVal(card) {
  return parseInt(card[0]
    .replace('T', 10)
    .replace('J', 11)
    .replace('Q', 12)
    .replace('K', 13)
    .replace('A', 14))
}

function doesPlayerOneWin([one, two]) {
  var paramsOne = getScoreParams(one)
  var paramsTwo = getScoreParams(two)

  if (paramsOne.score > paramsTwo.score)
    return true
  else if (paramsOne.score < paramsTwo.score)
    return false
  else {
    if (paramsOne.highCardOrder.length !== paramsTwo.highCardOrder.length) {
      console.log("ERROR: highCardOrder diff lengths same score ")
      throw { paramsOne, paramsTwo }
    }
    if (paramsOne.aceIsOne || paramsTwo.aceIsOne) {
      if (paramsOne.aceIsOne && !paramsTwo.aceIsOne)
        return false
      else if (!paramsOne.aceIsOne && paramsTwo.aceIsOne)
        return true
    }
    for (var i = 0; i < paramsOne.highCardOrder.length; i++) {
      if (paramsOne.highCardOrder[i] > paramsTwo.highCardOrder[i])
        return true
      else if (paramsOne.highCardOrder[i] < paramsTwo.highCardOrder[i])
        return false
    }
  }
}


/*
0: High Card
1: One Pair
2: Two Pairs
3: Three of a Kind
4: Straight
5: Flush
6: Full House
7: Four of a Kind
8: Straight Flush
*/
function getScoreParams(hand) {
  var isFlush = true, isStraight = true, groupings = {}, curr = hand[0], currN, lastN, suit, aceIsOne = false;

  suit = curr[1]
  lastN = getNumericVal(curr)
  for (let i = 1; i <= 4; i++) {
    curr = hand[i]
    currN = getNumericVal(curr)

    if (lastN === currN) {
      isStraight = false
      isFlush = false
      groupings[currN] = groupings[currN] ? groupings[currN] + 1 : 2
    } else {
      if (isFlush && curr[1] !== suit) {
        isFlush = false
      }
      if (isStraight && i === 4 && lastN === 5 && currN === 14) {
        aceIsOne = true
      } else if (isStraight && ((lastN + 1) !== currN)) {
        isStraight = false
      }
    }
    lastN = currN
  }
  return { score: getScore(isFlush, isStraight, groupings), highCardOrder: orderHighCards(groupings, hand.map(getNumericVal)), aceIsOne }
}

function orderHighCards(groupings, hand) {
  var result = []
  for (var key in groupings) {
    if (groupings[key] > 2)
      result.push(parseInt(key))
  }
  var pairs = []
  for (var key in groupings) {
    if (!result.includes(parseInt(key)))
      pairs.push(parseInt(key))
  }
  pairs.sort((a, b) => b - a)
  result = result.concat(pairs)

  for (var num of hand.reverse()) {
    if (!result.includes(num))
      result.push(num)
  }
  return result
}

function getScore(isFlush, isStraight, groupings) {
  if (isStraight || isFlush) {
    if (isStraight && isFlush)
      return 8
    else if (isStraight)
      return 4
    else
      return 5
  }
  var values = Object.values(groupings)
  if (values.length) {
    if (values.length === 1) {
      let n = values[0]
      if (n === 2)
        return 1
      if (n === 3)
        return 3
      else
        return 7
    } else {
      for (let n of Object.values(groupings)) {
        if (n === 3)
          return 6
      }
      return 2
    }
  } else {
    return 0
  }
}
