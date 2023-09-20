import { useState, useEffect } from 'react'
import axios from 'axios'

const CountriesList = ({ countries, showCountry }) => {
  return (
    <ul>
      {countries.map((country, index) => <li key={index}>{country.name.common}<button onClick={() => showCountry(country)}>show</button></li>)}
    </ul>
  )
}

const CountryDetail = ({ country }) => {
  if(!country) return null

  return (
    <>
      <h2>
        {country.name.common}
      </h2>
      {country.capital.map((capital, index) => <p key={index}>capital {capital}</p>)}
      <p>area {country.area}</p>
      <h3>
        languages:
      </h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img alt={country.flags.alt} src={country.flags.png}/>
    </>
  )
}

function App() {
  const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')
  const [shownCountry, setShownCountry] = useState(null)

  console.log('render')

  const filteredCountries = (countries && filter)
    ? countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    : null

  if(!shownCountry && filteredCountries && filteredCountries.length === 1) setShownCountry(filteredCountries[0])
  
  const singleCountry = (filteredCountries && filteredCountries.length === 1)
    ? filteredCountries[0]
    : null

  useEffect(() => {
    //fetch countries
    console.log('using effect')
    axios
      .get(allUrl)
      .then(response => {
        setCountries(response.data.map((country, index) => ({...country, originalIndex: index})))
        console.log('countries received')
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShownCountry(null)
  }

  return (
    <>
      <div>
        find countries
        <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        {filteredCountries
          && filteredCountries.length > 10
          && <p>Too many matches, specify another filter</p>}
        {filteredCountries
          && filteredCountries.length > 1
          && filteredCountries.length <= 10
          && <CountriesList countries={filteredCountries} showCountry={setShownCountry} />}
        {shownCountry && <CountryDetail country={shownCountry}/>}
      </div>
    </>
  )
}

export default App