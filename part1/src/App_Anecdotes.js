import { useState } from 'react'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const MaxVotes = (props) => {
  let maxPoint = Math.max(...props.arrPoints)
  if (maxPoint === 0){
    return(
      <div>
        Anecdote with most votes
      </div>
    )
  }
  return(
    <div>
      <p>Anecdote with most votes</p>
      <p>{props.anecdotes[props.arrPoints.indexOf(maxPoint)]}</p>
    </div>
  )
}

const Button = ({handleClick, text}) => (
    <button onClick={handleClick}>
      {text}
    </button>
  )
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const [selected, setSelected] = useState(0)
  const [arrPoints, setarrPoints]= useState(new Array(anecdotes.length).fill(0));

  const handleRandomClick = () => {
    setSelected(getRandomInt(anecdotes.length))
  }

  const handleArrClick = () => {
    const pointsCopy = [...arrPoints];
    pointsCopy[selected] += 1;
    setarrPoints(pointsCopy);
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>has {arrPoints[selected]} votes</p>
      <Button handleClick={handleArrClick} text="vote" />
      <Button handleClick={handleRandomClick} text="next anecdote" />
      <MaxVotes arrPoints={arrPoints} anecdotes={anecdotes}/>
    </div>
  )
}

export default App