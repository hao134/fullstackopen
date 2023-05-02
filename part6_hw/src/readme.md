# 首頁如此：
![](https://i.imgur.com/H3nwnxP.png)

## 首頁的配置呈現為：
```javascript
return (
    <div>
      <Notification />
      <AnecdoteList />
      <Filter />
      <AnecdoteForm />
    </div>
  )
```
將照順序講解

## Notification
### 當我們對第一則"Notification func is improved at 2023.3.9投票時"
![](https://i.imgur.com/1weyJqe.png)
### 會產生提醒
![](https://i.imgur.com/oXmu9m0.png)

* Notification 這個component 是長這樣的：
```javascript
const Notification = () => {
    const notification = useSelector((state) => state.notification)
    const style = {
      border: "solid",
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: "lightgrey",
      color: "green",
    };
    if (notification === null) {
      return null
    }
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
```
當有notification產生時，它就印出，比如在AnecdoteList.js中的handleAddVote：
```javascript
import { NOTIFICATION } from "../reducers/notificationReducer";
const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const handleAddVote = async (id) => {
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
        const addedAnecdote = {...anecdote, votes: anecdote.votes + 1}
        dispatch(AddVote(id, addedAnecdote))
        dispatch(NOTIFICATION(`You voted for ${anecdote.content}`, 5))
    }
    //...
}
```
且在notificationReducer裡：
```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state = action.payload
      return state
    },
    hideNotification(state, action) {
      return initialState
    }
  }
})
  
export const { setNotification, hideNotification } = notificationSlice.actions

export const NOTIFICATION = (text, time) => {
  return dispatch => {
    dispatch(setNotification(text))
    setTimeout(() => dispatch(hideNotification()), time*1000)
  }
}
export default notificationSlice.reducer
```
這兩個file裡面的這兩段，：
```javascript
//...
const dispatch = useDispatch()
const handleAddVote = async (id) => {
        //...
        dispatch(NOTIFICATION(`You voted for ${anecdote.content}`, 5))
    }
//...
export const NOTIFICATION = (text, time) => {
  return dispatch => {
    dispatch(setNotification(text))
    setTimeout(() => dispatch(hideNotification()), time*1000)
  }
}
//...
```

上面那一段中，使用useDispatch hook來取得dispatch函式，handleAddVote觸發時，調用NOTIFICATION action creator，進而設置notification:`You voted for ${anecdote.content}`並將其存儲在Redux store中。

下面那一段是一個Redux action creator，用來設置notification。它返回一個函式，這個函式接受一個dispatch參數，它會使用dispatch來發送一個action給Redux store

這種方式是Redux提供的一種action creators使用方法，稱為`thunk`，它允許我們在action creators中返回一個函式，而不是一個純物件的action。當使用Redux thunk時，我們可以在action creators中執行任意的非同步邏輯，例如從API獲取資料，然後在資料獲取完成後使用dispatch函式來發送一個action。這種方式提高了應用程式的靈活性，使我們可以將邏輯放在action creators中，而不是分散在應用程式中的各個地方。

## AnecdoteList
首先資料是存在db.json裡面，要獲得這些資料要先使用`get` method來取得，
在anecdoteReducer.js裡：
```javascript
//...
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
//...
```
在App.js裡：
```javascript
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes())
  },[dispatch])
  //...
}
```
同樣的，這段在anecdoteReducer.js裡的程式碼是一個Redux action creator，用來初始化應用程式中的anecdotes資料。它返回一個函式，這個函式接受一個dispatch參數，然後使用async/await語法調用anecdoteService.getAll()，獲取anecdotes資料。一旦成功獲取anecdotes，它會使用dispatch來發送一個action給Redux store。

在App.js中，使用useDispatch hook來取得dispatch函式，然後使用useEffect hook在應用程式渲染完成後調用initializeAnecdotes action creator，進而獲取anecdotes並將其存儲在Redux store中。

在AnecdoteList.js中，可以看到首頁anecdote list的安排方式：
```javascript
import { useDispatch, useSelector } from "react-redux"
import { AddVote } from "../reducers/anecdoteReducer";
import { NOTIFICATION } from "../reducers/notificationReducer";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const handleAddVote = async (id) => {
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
        const addedAnecdote = {...anecdote, votes: anecdote.votes + 1}
        dispatch(AddVote(id, addedAnecdote))
        dispatch(NOTIFICATION(`You voted for ${anecdote.content}`, 5))
    }

    return (
        <div>
            <h2>Anecdotes</h2>
            {anecdotes
                .filter((anecdote) => anecdote.content.includes(filter))
                .sort((a, b) => b.votes - a.votes)
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}{' '}
                            <button onClick={() => handleAddVote(anecdote.id)}>vote</button>
                        </div>
                    </div>
                )}
        </div>
    )
}
```
而在handleAddVote中：
```javascript
const handleAddVote = async (id) => {
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
        const addedAnecdote = {...anecdote, votes: anecdote.votes + 1}
        dispatch(AddVote(id, addedAnecdote))
        dispatch(NOTIFICATION(`You voted for ${anecdote.content}`, 5))
    }
```
調用來自anecdoteReducer.js的應用是：
```javascript
const anecdoteSlice = createSlice({
  //...
  reducers: {
    addVote(state, action){
      const id = action.payload
      const anecdoteToAdd = state.find(a => a.id === id)
      const addedAnecdote = {
        ...anecdoteToAdd,
        votes: anecdoteToAdd.votes + 1
      }
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : addedAnecdote
      )
    },
    //...
  }
})
export const AddVote = (id, content) => 
  return async dispatch => {
    await anecdoteService.update(id, content)
    dispatch(addVote(id))
  }
}
```

## Filter
在Filter.js中：
```javascript
import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = (props) => {
    const dispatch = useDispatch()
    const handleChange = (event) => {
      // input-field value is in variable event.target.value
      event.preventDefault()
      dispatch(filterChange(event.target.value))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter
```
且在filterReducer.js中：
```javascript
import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChange(state, action) {
      state = action.payload
      return state
    }
  }
})
  
export const { filterChange } = filterSlice.actions
export default filterSlice.reducer
```
因此在filter form 中預設是''，當我們輸入任何字，filter就為任何我們輸入的字


## AnecdoteForm
在AnecdoteReducer.js中：
```javascript
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}
```
和前面addVote的方法類似，只是這裡用`post`方法了