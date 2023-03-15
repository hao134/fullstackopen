import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then(response => {
        console.log('promise fulfilled')
        setCountry(response.data[0])
      })
      .catch((error)=>{
        setCountry(null)
      })
  }, [name])

  return country
}