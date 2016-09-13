var name = document.body.attributes[0].name

if (name === 'sum') require('./sum')
else if (name === 'who-to-follow') require('./who-to-follow')
else if (name === 'multiple-clicks') require('./multiple-clicks')
else if (name === 'drag-and-drop') require('./drag-and-drop')
else if (name === 'secret-combination') require('./secret-combination')
else console.warn('Unknown name attribute:', name)
