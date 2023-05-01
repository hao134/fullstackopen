# 首頁如此
![](https://i.imgur.com/4mdyvsK.png)
```javascript
const App = () => {
  return (
    <div>
      <div>
        <button
          onClick={e => store.dispatch({ type: 'GOOD' })}
        >
          good
        </button>
        <button
          onClick={e => store.dispatch({ type: 'OK' })}
        >
          ok
        </button>
        <button
          onClick={e => store.dispatch({ type: 'BAD' })}
        >
          bad
        </button>
        <button
          onClick={e => store.dispatch({ type: 'ZERO' })}
        >
          reset
        </button>
        <div>good {store.getState().good}</div>
        <div>ok {store.getState().ok}</div>
        <div>bad {store.getState().bad}</div>
      </div>
    </div>
  )
}
```
按下三個按鈕代表的字會觸發按鈕上代表的字，如按下"good"，
![](https://i.imgur.com/B9KmSTm.png)
會有這樣的效果，因為設置了如下的reducer:
```javascript
const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }
  
  const counterReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
      case 'GOOD':
        return {...state, good: state.good + 1}
      case 'OK':
        return {...state, ok: state.ok + 1}
      case 'BAD':
        return {...state, bad: state.bad + 1}
      case 'ZERO':
        return initialState
      default: return state
    }
  
  }
  
  export default counterReducer
```