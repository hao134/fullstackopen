import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Select from 'react-select';
import { TextField, Button } from "@mui/material";

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const SetBirthYear = ({ authors, setError }) => {
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const [ changeBirth, result ] = useMutation(EDIT_AUTHOR,{
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      error.graphQLErrors > 0
        ? setError(error.graphQLErrors[0].message)
        : setError(error.message)
    }
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

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('Author not found')
    }
  }, [result.data]) // eslint-disable-line
  return (
    <div>
      <h2>Set BirthYear</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: "0.5rem" }}>
          <Select
            value={selectedOption}
            onChange={handleSelect}
            options={options}
          />
        </div>
        <div>
          <TextField label="born" type="number" value={birth} onChange={({ target }) => setBirth(target.value)}/>
        </div> 
        <Button
          variant="contained"
          color="primary"
          type="submit"
        >
          update author
        </Button>

      </form>
    </div>
  )
}

export default SetBirthYear