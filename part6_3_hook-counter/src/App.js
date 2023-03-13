import { useReducer } from 'react'
import Button from './components/Button'
import Display from './components/Display'
import CounterContext from './CounterContext'

const counterReducer = (state, action) => {
  switch (action.type) {
    case "INC":
        return state + 1
    case "DEC":
        return state - 1
    case "ZERO":
        return 0
    default:
        return state
  }
}


const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer,0)

  return (
    <CounterContext.Provider value={[counter, counterDispatch]}>
      <Display counter={counter}/>
      <div>
        <Button type='INC' label='+' />
        <Button type='DEC' label='-' />
        <Button type='ZERO' label='0' />
      </div>
    </CounterContext.Provider>
  )
  // return (
  //   <CounterContext.Provider value={[counter, counterDispatch]}>
  //     <div>{counter}</div>
  //     <div>
  //       <button onClick={() => counterDispatch({ type: "INC" })}>+</button>
  //       <button onClick={() => counterDispatch({ type: "DEC" })}>-</button>
  //       <button onClick={() => counterDispatch({ type: "ZERO" })}>0</button>
  //     </div>
  //   </CounterContext.Provider>
  // )
}

export default App