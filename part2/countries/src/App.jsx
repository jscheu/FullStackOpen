import { useState, useEffect } from 'react'
import axios from 'axios'

const CountriesList = ({ countries }) => {
  if(!countries) return null

  if(countries.length > 10) {
    return (
      <>
        <p>Too many matches, specify another filter</p>
      </>
    )
  } else {
    return (
      <ul>
        {countries.map((country, index) => <li key={index}>{country}</li>)}
      </ul>
    )
  }
}

function App() {
  const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')

  const filteredCountries = (countries && filter)
    ? countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    : null

  useEffect(() => {
    //fetch countries
    axios
      .get(allUrl)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <>
      <div>
        find countries
        <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        <CountriesList
          countries={
            filteredCountries
            ? filteredCountries.map(country => country.name.common)
            : null} />
      </div>
    </>
  )
}

export default App