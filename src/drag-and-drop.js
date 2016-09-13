const takeUntil = require('flyd/module/takeuntil')
const flatMap = require('flyd/module/flatmap')
const flyd = require('flyd')

var drag = document.getElementById('drag')

var mousedown  = flyd.stream()
var mousemove  = flyd.stream()
var mouseup    = flyd.stream()

drag.addEventListener('mousedown', mousedown)
document.addEventListener('mousemove', mousemove)
document.addEventListener('mouseup', mouseup)

/*
flatMap
Maps a function over a stream of streams and flattens the result to a single stream
Given a stream of streams, returns a single stream of merged values from the created streams.
Parameters
- fn      <Function> Stream producing function `(x) -> stream.<v>`
- stream  <stream>   Stream to flat map values through f
*/
var mousedrag = flatMap(function(down) {
  console.log('down:', down)

  /*
  takeUntil(stream1, stream2)
  Emit values from a stream until a second stream emits a value
  will emit all values on `stream1` until `stream2` emits a value or ends
  */
  return takeUntil(flyd.map(function(move) {
    console.log('move:', move)
    move.preventDefault()

    return {
      left: move.clientX - down.offsetX,
      top:  move.clientY - down.offsetY
    }
  }, mousemove), mouseup)
}, mousedown)

/*
flyd.on(fn, s)
Similar to map except that the returned stream is empty
Use on for doing side effects in reaction to stream changes
Use the returned stream only if you need to manually end it
*/
flyd.on(function(pos) {
  Object.assign(drag.style, {top:`${pos.top}px`, left:`${pos.left}px`})
}, mousedrag)
