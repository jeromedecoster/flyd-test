const flyd = require('flyd')

var suggestions = document.querySelector('.suggestions')
var refresh = document.getElementById('refresh')

// Get a random integer
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Get a random item from an array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Take action & model, return updated model
function update(model, action) {
  console.log('update model:', model, 'action:', action)

  if (action.type === 'loaded') {
    return {
      loaded:    action.data,
      // pick the 3 first items in data
      suggested: action.data.slice(0, 3)
    }

  } else if (action.type === 'remove') {
    // swap the item at `ìdx` with a random item picked from the 30 loaded
    model.suggested[action.idx] = randomItem(model.loaded)
    return {
      loaded:    model.loaded,
      suggested: model.suggested
    }
  }
}

// Take model, modify DOM
function render(model) {
  console.log('render model:', model)
  suggestions.style.visibility = model.suggested.length === 0
    ? 'hidden'
    : 'visible'

  model.suggested.forEach(function(user, i) {
    var el = suggestions.children[i]
    Object.assign(el.querySelector('.username'), {href:user.html_url, textContent: user.login})
    Object.assign(el.querySelector('img'),       {src: user.avatar_url})
  })
}

var initialState = {
  loaded:    [],
  suggested: []
}

// Streams
var action = flyd.stream()

/*
flyd.scan
Creates a new stream with the results of calling the function on every incoming stream
with and accumulator and the incoming value.
Parameters
- fn      <Function> the function to call
- val     <Any>      the initial value of the accumulator
- stream  <stream>   the stream source
*/
var model = flyd.scan(update, initialState, action)

/*
flyd.map(fn, stream)
Map a stream
Returns a new stream consisting of every value from `stream` passed through `fn`.
Parameters
- fn      <Function> the function that produces the elements of the new stream
- stream  <stream>   the stream to map
*/
flyd.map(render, model)

function makeRequest() {
  // github public api return 30 users data from `since`
  var url = 'https://api.github.com/users?since=' + randomInt(0, 500)
  return fetch(url)
    .then(function(res) {
      // convert fetch Response to JSON
      return res.json()
    })
    .then(function(data) {
      action({type:'loaded', data:data})
    })
}


refresh.addEventListener('click', makeRequest)

Array.from(suggestions.querySelectorAll('button'))
  .forEach((e, i) => {
    e.addEventListener('click', () => action({type:'remove', idx:i}))
  })


makeRequest()
