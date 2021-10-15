var appleVersionHistory = require('./dist/src/index')
var temp = require('./temp.json')

var mybuilds = appleVersionHistory.flatlistBuilds('ios').concat(appleVersionHistory.flatlistBuilds('tvos')).concat(appleVersionHistory.flatlistBuilds('macos'))
var comparison = temp.map(x => x.match(/\((?<build>.*)\)/).groups.build).filter(x => mybuilds.every(t => !t.includes(x)))

console.log(comparison.join(','))
console.log(comparison.length)