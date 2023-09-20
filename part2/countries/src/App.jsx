import { useState, useEffect } from 'react'
import axios from 'axios'

const CountriesList = ({ countries, showCountry }) => {
  return (
    <ul>
      {countries.map((country, index) => <li key={index}>{country.name.common} {country.originalIndex}<button onClick={() => showCountry(country)}>show</button></li>)}
    </ul>
  )
}

const CurrentWeather = ({ city, lat, lon }) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`

  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    //fetch weather data
    axios
    .get(apiUrl)
    .then(response => {
      setWeatherData(response.data)
    })
  }, [city])

    if(!weatherData) return null

    return (
      <div>
        <h2>Weather in {city}</h2>
        <img
          alt={weatherData.weather[0].description}
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
        <p>temperature {weatherData.main.temp} Celcius</p>
        <p>wind {weatherData.wind.speed} m/s</p>
      </div>
    )
}

const CountryDetail = ({ country }) => {
  if(!country) return null

  const latlng = (country.capitalInfo.hasOwnProperty('latlng'))
    ? country.capitalInfo.latlng
    : country.latlng

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
      <CurrentWeather
        city={country.capital[0]}
        lat={latlng[0]}
        lon={latlng[1]} />
    </>
  )
}

function App() {
  const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')
  const [shownCountry, setShownCountry] = useState(null)

  const filteredCountries = (countries && filter)
    ? countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    : null

  if(!shownCountry && filteredCountries && filteredCountries.length === 1) setShownCountry(filteredCountries[0])
  
  const singleCountry = (filteredCountries && filteredCountries.length === 1)
    ? filteredCountries[0]
    : null

  useEffect(() => {
    //fetch countries
    axios
      .get(allUrl)
      .then(response => {
        setCountries(response.data.map((country, index) => ({...country, originalIndex: index})))
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