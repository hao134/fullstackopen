import { useState } from 'react'

const Staticline = (props) => {
  return(
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}


const Statictics = (props) => {
    if (props.allClicks.length === 0) {
      return (
        <div>
          No feedback given
        </div>
        
      )
    }
    return (
      <div>
        <table>
          <tbody>
            <Staticline text="good" value={props.good}/>
            <Staticline text="neutral" value={props.neutral}/>
            <Staticline text="bad" value={props.bad}/>
            <Staticline text="average" value={props.count/props.allClicks.length}/>
            <Staticline text="positive" value={(props.good/props.allClicks.length)*100 + "%"}/>
          </tbody>
        </table>
        
      </div>
    )
  }

const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
      {text}
    </button>
  )


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [count, setCount] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setAll(allClicks.concat('G'))
    setCount(count + 1)
    setGood(good + 1)
  }

  const handleNeutralClick = () =>{
    setAll(allClicks.concat('N'))
    setCount(count + 0)
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setAll(allClicks.concat('B'))
    setCount(count - 1)
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>Statistics</h1>
      <Statictics good={good} neutral={neutral} bad={bad} count={count} allClicks={allClicks} />
    </div>
  )
}

export default App