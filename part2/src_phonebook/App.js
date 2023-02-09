import { useState } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const App = (props) => {
  const [persons, setPersons] = useState(props.persons)
  const [newPerson, setNewPerson] = useState({name: "", number: ""})
  const [filter, setFilter] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons);

  const addPerson = (event) => {
    event.preventDefault()
    const currentName = persons.filter((person)=>person.name===newPerson.name)
    if(currentName.length===0){
      const personObject = {
        name: newPerson.name,
        number: newPerson.number,
        date: new Date().toISOString(),
        id: newPerson.name
      };
      setPersons(persons.concat(personObject))
      setPersonsToShow(persons.concat(personObject))
    }else{
      alert(`${newPerson.name} is already added to phonebook`)
    }
    setNewPerson({name: "", number: ""})
  }

  const handleChange = (event) => {
    // form's name and value
    const {name, value} = event.target;
    // form of newPerson: {name: '', number: ''}
    // when [name] is name is "a" -> add {name: "a"}
    // when [name] is number is "1" -> add {number: "1"}
    setNewPerson({...newPerson, [name]: value});
    // see how it works
    console.log(newPerson)
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
      <Filter value={filter} filterByName={filterByName}/>
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newPerson={newPerson}
        handleChange={handleChange}
      />
      <h2>Numbers</h2>
      

      <Persons personsToShow={personsToShow}/>

    </div>
  )
}

export default App