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
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  // click handler logic
  const generateHandleClick = (prevCount, setterFunc) => () => {
    const newCount = prevCount + 1
    setterFunc(newCount)
  }

  const handleGoodClick = generateHandleClick(good, setGood)
  const handleNeutralClick = generateHandleClick(neutral, setNeutral)
  const handleBadClick = generateHandleClick(bad, setBad)

  const handleAnecdoteClick = () => {
    const rand = Math.floor(Math.random() * anecdotes.length)
    setSelected(rand)
  }

  const handleVoteClick = (voted) => {
    const newPoints = [...points]
    newPoints[voted] += 1
    setPoints(newPoints)
  }

  let maxIndex = 0;
  let maxValue = points[0]

  for (let i = 1; i < points.length; i++) {
    if (points[i] > maxValue) {
      maxValue = points[i]
      maxIndex = i
    }
  }

  return (
    <div>
      <div>
        <Header title={inputTitle}/>
        <Button text="good" handleClick={handleGoodClick} />
        <Button text="neutral" handleClick={handleNeutralClick} />
        <Button text="bad" handleClick={handleBadClick} />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
      <div>
        <Header title="Anecdote of the day" />
        <p>{anecdotes[selected]}</p>
        <p>has {points[selected]} votes</p>
        <Button text="vote" handleClick={() => handleVoteClick(selected)} />
        <Button text="next anecdote" handleClick={handleAnecdoteClick}/>
        <Header title="Anecdote with most votes" />
        <p>{anecdotes[maxIndex]}</p>
        <p>has {maxValue} votes</p>
      </div>
    </div>
  )
}

export default App