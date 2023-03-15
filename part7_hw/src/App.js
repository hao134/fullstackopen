import { useState } from 'react'
import CountryData from './components/CountryData'
import { useField, useCountry } from './hooks'

const App = () => {
  const query = useField('text')
  const [ name, setName ] = useState('')
  const country = useCountry(name)
  
  const fetch = (e) => {
    e.preventDefault()
    setName(query.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        Find countries <input {...query} />
        <button>find</button>
      </form>
      <CountryData country={country}/>
    </div>
  )
}

export default App
