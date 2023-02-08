import { useState } from 'react'
import Person from './components/Person'

const App = (props) => {
  const [persons, setPersons] = useState(props.persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons);

  const addPerson = (event) => {
    event.preventDefault()
    const currentName = persons.filter((person)=>person.name===newName)
    if(currentName.length===0){
      const personObject = {
        name: newName,
        number: newNumber,
        date: new Date().toISOString(),
        id: newName
      };
      setPersons(persons.concat(personObject))
      setPersonsToShow(persons.concat(personObject))
    }else{
      alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event)=>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const filterByName = (event) => {
    const search = event.target.value;
    setFilter(search);
    setPersonsToShow(
      persons.filter((person)=>person.name.toLowerCase().includes(search))
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with<input value={filter} onChange={filterByName} /></div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number<input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      
      {personsToShow.map(person =>
        <Person key={person.id} person={person} />
      )}

    </div>
  )
}

export default App