var sampleOn = require('flyd/module/sampleon')
var filter = require('flyd/module/filter')
var inLast = require('flyd/module/inlast')
var lift = require('flyd/module/lift')
var flyd = require('flyd')

var seq = 'abbaba'
var lng = seq.length
var time = 5000

var setMsg = function(msg) { message.innerHTML = msg; };

var clicks = flyd.stream()
a.addEventListener('click', () => clicks('a'))
b.addEventListener('click', () => clicks('b'))

/*
flyd.scan(fn, acc, stream)
Creates a new stream with the results of calling the function on every incoming stream with and accumulator and the incoming value.
Parameters
- fn      <Function> the function to call
- acc     <Any>      the initial value of the accumulator
- stream  <stream>   the stream source
*/
var correctClicks = flyd.scan(function(idx, char) {
  // console.log('scan idx:', idx, 'char:', char)
  var count = seq[idx] === char
        ? idx + 1
        : seq[0] === char
          ? 1
          : 0
  return count
}, 0, clicks)

/*
Creates a stream with emits a list of all values from the source stream that where emitted in a specified duration.
Not really documented
*/
var clicksInLast5s = inLast(time, clicks);

/*
lift()
No doc...
*/
lift(function(corrects, inLast5s) {
  var complete = corrects === lng, inTime = inLast5s.length >= lng
  setMsg(complete && inTime  ? 'Combination unlocked'
       : complete && !inTime ? "You're not fast enough, try again!"
                             : corrects + ' key')

/*
sampleOn
Samples from the second stream every time an event occurs on the first stream.
*/
}, correctClicks, sampleOn(clicks, clicksInLast5s))

flyd.map(function(c) { console.log('cor', c); }, correctClicks)
flyd.map(function(c) { console.log('lst', c); }, clicksInLast5s)
