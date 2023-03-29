import { useState } from "react";
import { useMutation } from "@apollo/client";
import Select from 'react-select';

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const [ changeBirth ] = useMutation(EDIT_AUTHOR,{
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const submit = (event) => {
    event.preventDefault()
    changeBirth({ variables: { name, setBornTo: parseInt(birth) }})

    setName('')
    setBirth('')
  }
  const options = authors.map(item => {
    return {
      value: item.name,
      label: item.name
    }
  })

  const handleSelect = (selectedOption) => {
    setSelectedOption(selectedOption)
    setName(selectedOption.value)
  }

  return (
    <div>
      <h2>Set BirthYear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedOption}
            onChange={handleSelect}
            options={options}
          />
        </div>
        <div>
          born <input
            type="number"
            value={birth}
            onChange={({ target }) => setBirth(target.value)}
          />
        </div> 
        <button type="submit">update author</button> 

      </form>
    </div>
  )
}

export default SetBirthYear