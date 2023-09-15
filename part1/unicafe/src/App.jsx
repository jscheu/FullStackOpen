import { useState } from 'react'

const inputTitle = 'give feedback'
const statisticsTitle = 'statistics'

const Header = ({title}) => <h1>{title}</h1>

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Statistic = ({name, count}) => {
  return (
    <p>{name} {count}</p>
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
      <div>
        <Header title={statisticsTitle}/>
        <Statistic name="good" count={good}/>
        <Statistic name="neutral" count={neutral}/>
        <Statistic name="bad" count={bad}/>
      </div>
    </div>
  )
}

export default App