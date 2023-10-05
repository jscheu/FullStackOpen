import { useState, useEffect } from 'react'
import personService from './services/persons'

import './index.css'

const Notification = ({ message }) => {
  if(!message) {
    return null
  }

  return (
    <div className={message.type}>
      {message.body}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
        filer shown with <input value={filter} onChange={handleFilterChange} />
      </div>
  )
}

const NewPersonForm = ({ newName, newNumber, addPerson, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const ContactList = ({ persons, deletePerson }) => {
  return (
    <>
      {persons.map(person =>
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id, person.name)}>delete</button></div>)
      }
    </>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('enter name...')
  const [newNumber, setNewNumber] = useState('enter number...')
  const [filter, setFilter] = useState('')
  const [notify, setNotify] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {setPersons(initialPersons)})
  }, [])

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newPerson.name)

    if (existingPerson) {
      const result = window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)

      if(result) {
        personService
          .update(existingPerson.id, newPerson)
          .then(() => {
            newPerson['id'] = existingPerson.id
            setPersons(persons.map(person => (person.id === newPerson.id ? newPerson : person)))
            setNotify({
              body: `Updated ${newPerson.name}`,
              type: 'update'
            })
            setTimeout(() => {
              setNotify(null)
            }, 5000)
          })
          .catch(() => {
            setNotify({
              body: `${name} has already been removed from the server`,
              type: 'error'
            })
            setTimeout(() => {
              setNotify(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('enter name...')
          setNewNumber('enter number...')
          setNotify({
            body: `Added ${returnedPerson.name}`,
            type: 'update'
          })
          setTimeout(() => {
            setNotify(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotify({
            body: error.response.data.error,
            type: 'error'
          })
          setTimeout(() => {
            setNotify(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id, name) => {
    const result = window.confirm(`Delete ${name}?`)

    if(result) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotify({
            body: `Deleted ${name}`,
            type: 'update'
          })
          setTimeout(() => {
            setNotify(null)
          }, 5000)
        })
        .catch(error => {
          setNotify({
            body: `${name} has already been removed from the server`,
            type: 'error'
          })
          setTimeout(() => {
            setNotify(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notify} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <NewPersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <ContactList persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App