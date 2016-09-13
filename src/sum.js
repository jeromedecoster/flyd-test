const getAttributes = require('dom-funcs/get-attributes')
const flyd = require('flyd')

var sumBox = document.getElementById('sumBox')
var xBox = document.getElementById('xBox')
var yBox = document.getElementById('yBox')

var x = flyd.stream(10)
var y = flyd.stream(20)
var sum = flyd.combine(function(x, y) {
  return x() + y()
}, [x, y])


flyd.map(function(sum) {
  sumBox.innerHTML = sum
}, sum)

flyd.map(function(x) {
  xBox.innerHTML = x
}, x)

flyd.map(function(y) {
  yBox.innerHTML = y
}, y)

// Do animations
function animate(s, elm) {
  flyd.map(function() {
    elm.classList.add('flash')
    setTimeout(function() {
      elm.classList.remove('flash')
    }, 220)
  }, s)
}
animate(x, xBox)
animate(y, yBox)
animate(sum, sumBox)

var click = flyd.stream()

Array.from(document.querySelectorAll('[click]'))
  .forEach(e => e.addEventListener('click', click))

flyd.map(function(event) {
  var obj = getAttributes(event.target, 'click')
  if (obj.x) x(obj.x)
  else if (obj.y) y(obj.y)
  else if (obj.inc == 'x') x(x() + 1)
  else if (obj.dec == 'x') x(x() - 1)
  else if (obj.inc == 'y') y(y() + 1)
  else if (obj.dec == 'y') y(y() - 1)
}, click)
