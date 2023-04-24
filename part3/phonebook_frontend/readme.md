# 首頁如此：
![](https://i.imgur.com/8sglGgj.png)

* 首先取得後端資料，並印在網頁上：
```javascript
useEffect(() => {
  phonebookServices
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
      setPersonsToShow(initialPersons)
    })
}, [])
```
```jsx
return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filter} filterByName={filterByName} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newPerson={newPerson}
        handleChange={handleChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
```
* 當添加一個新人時，按下submit的當下，會進行這些處理：
```javascript
const addPerson = (event) => {
    event.preventDefault()
    const currentName = persons.filter((person) => person.name === newPerson.name)
    const personObject = {
      name: newPerson.name,
      number: newPerson.number,
      date: new Date().toISOString(),
      id: newPerson.name
    };
    if (currentName.length === 0) {
      phonebookServices
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setPersonsToShow(persons.concat(returnedPerson))
          setMessage(
            `Added ${personObject.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
      
    } else {
      if (window.confirm(`${currentName[0].name} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookServices
          .update(currentName[0].id, personObject)
          .then((returnedPerson) => {
            const updatedPersons = persons.map(person => 
              person.id !== returnedPerson.id ? person : returnedPerson
            )
            setPersons(updatedPersons)
            setPersonsToShow(updatedPersons)
          })
          .catch(error => {
            setMessage(error.response.data.error)
            setTimeout(()=>{
              setMessage(null)
            }, 3000)
          })
      }
    }
    setNewPerson({ name: "", number: "" })
  }
```
它首先確認添加的人有沒有已經包含在裡面了（currentName)，若沒有就直接進行添加（以create方法），若有，則提問是否進行更改（以update方法）

* handle input的值的方法（說明已在註解）：
```javascript
const handleChange = (event) => {
    // form's name and value
    const { name, value } = event.target;
    // form of newPerson: {name: '', number: ''}
    // when [name] is name is "a" -> add {name: "a"}
    // when [name] is number is "1" -> add {number: "1"}
    setNewPerson({ ...newPerson, [name]: value });
    // see how it works
    console.log(newPerson)
  }
```

## 查找用戶（用filter）
![](https://i.imgur.com/ZF4nWsM.png)
```javascript
const filterByName = (event) => {
    const search = event.target.value;
    setFilter(search);
    setPersonsToShow(
      persons.filter((person) => person.name.toLowerCase().includes(search))
    )
  }
```