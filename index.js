const scripts = require('./scripts')


const scriptName = 'coinPartitions' /* input here, name of script */
const args = [10] /* place args here */

var result = scripts[scriptName](...args)
console.log("final result: ", result)
