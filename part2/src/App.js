import { useState, useEffect} from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import CountryData from './components/Countrydata'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [countrytoshow, setCountrytoshow] = useState([]);

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')


  const queryByName = (event) => {
    const search = event.target.value;
    setQuery(search);
    setCountrytoshow(
      countries.filter((country)=>country.name.common.toLowerCase().includes(search))
    )
  }

  return (
    <div>
      <div>
        Find countries <input value={query} onChange={queryByName}/>
      </div>
      {countrytoshow.length === 1 ?(
        <CountryData country={countrytoshow[0]} />
      ): null}
      {countrytoshow.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ):(
        <Countries
          countriesToShow={countrytoshow}
          setCountriesToShow={setCountrytoshow}
        />
      )}
    </div>
  )
}

export default App