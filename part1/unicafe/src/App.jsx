import { useState } from 'react'

const inputTitle = 'give feedback'
const statisticsTitle = 'statistics'

const Header = ({title}) => <h1>{title}</h1>

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({type, text, value}) => {
  if (type === "percent") return (
    <tr>
      <td>{text}</td>
      <td>{value} %</td>
    </tr>
  )
  else return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad

  if(total > 0) {
    const average = total === 0 ? 0 : (good - bad)/total

    const percPositive = total === 0 ? 0 : (100 * good)/total

    return (
      <div>
          <Header title={statisticsTitle} />
          <table>
            <tbody>
              <StatisticLine text="good" value={good} />
              <StatisticLine text="neutral" value={neutral} />
              <StatisticLine text="bad" value={bad} />
              <StatisticLine text="all" value={total} />
              <StatisticLine text="average" value={average} />
              <StatisticLine type="percent" text="positive" value={percPositive} />
            </tbody>
          </table>
        </div>
    )
  } else return (
    <div>
      <Header title={statisticsTitle} />
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const generateHandleClick = (feedbackType, setterFunc) => () => {
    console.log(`The 'setFeedback' function is being called with feedback of '${feedbackType}'`)
    setterFunc(prevCount => prevCount + 1)
  }

  const handleGoodClick = generateHandleClick("good", setGood)
  const handleNeutralClick = generateHandleClick("neutral", setNeutral)
  const handleBadClick = generateHandleClick("bad", setBad)

  return (
    <div>
      <div>
        <Header title={inputTitle}/>
        <Button text="good" handleClick={handleGoodClick} />
        <Button text="neutral" handleClick={handleNeutralClick} />
        <Button text="bad" handleClick={handleBadClick} />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App