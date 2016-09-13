const afterSilence = require('flyd/module/aftersilence')
const flyd = require('flyd')

var btn = document.getElementById('btn')
var msg = document.getElementById('msg')

var click = flyd.stream()
btn.addEventListener('click', click)

/*
aftersilence(ms, stream)
Buffers values from a source stream in an array and emits it after a specified duration of silence from the source stream.
Parameters
- ms      <Integer>  the debounce delay
- stream  <stream>   the stream source
*/
// Grouped clicks
var grouped = afterSilence(250, click)

/*
flyd.map(fn, stream)
Map a stream
Returns a new stream consisting of every value from `stream` passed through `fn`.
Parameters
- fn      <Function> the function that produces the elements of the new stream
- stream  <stream>   the stream to map
*/
// Count clicks
// param `clicks` is an array of MouseEvent.click
var count = flyd.map(function(clicks) {
  console.log(time() + ' grouped update')
  return clicks.length
}, grouped)

// react to `count` stream updates
flyd.map(function(lng) {
  console.log(time() + ' count update')
  msg.textContent = lng === 1
    ? '1 click'
    : lng + ' clicks'
}, count)

// emit 1 sec after the last `count` emitted
var counted = afterSilence(1000, count)

flyd.map(function() {
  console.log(time() + ' counted update')
  msg.textContent = ''
}, counted)

function time() {
  var d = new Date()
  var ms = d.getMilliseconds().toString()
  while (ms.length < 3) ms = '0' + ms
  return d.toString().substr(15, 9) + '.' + ms
}
