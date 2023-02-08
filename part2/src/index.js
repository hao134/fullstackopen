import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const persons = [
  { 
    name: 'Arto Hellas',
    number: '0313-314141',
    date: new Date().toISOString(),//'2019-05-30T19:20:14.298Z',
    id: 'Arto Hellas',
  },
  { 
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    date: new Date().toISOString(),//'2019-05-30T19:20:14.298Z',
    id: 'Ada Lovelace',
  },
  { 
    name: 'Dan Abramov',
    number: '12-43-234345',
    date: new Date().toISOString(),//'2019-05-30T19:20:14.298Z',
    id: 'Dan Abramov',
  },
  { 
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    date: new Date().toISOString(),//'2019-05-30T19:20:14.298Z',
    id: 'Mary Poppendieck',
  },

]
ReactDOM.createRoot(document.getElementById('root')).render(
  <App persons={persons}/>
)