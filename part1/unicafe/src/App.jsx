import { useState } from 'react'

const inputTitle = 'give feedback'
const statisticsTitle = 'statistics'

const Header = ({title}) => <h1>{title}</h1>

const Button = ({text}) => {
  return (
    <button>{text}</button>
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

  return (
    <div>
      <div>
        <Header title={inputTitle}/>
        <Button text="good" />
        <Button text="neutral" />
        <Button text="bad" />
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