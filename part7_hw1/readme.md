# anecdote:
## 首頁如此：
![](https://hackmd.io/_uploads/BkmOP8Fth.jpg)


## 首頁的配置呈現為：
```javascript
return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification}/>
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/about" element={<About />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
      </Routes>
      <Footer />
    </div>
  )
```


## 而在path /create中畫面為：
![](https://hackmd.io/_uploads/SkYvsLKY2.jpg)
* 如何設定在path /create分頁, 在App.js：
```javascript
import {
  Routes,
  Route,
} from "react-router-dom"
//...
<Routes>
  <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
  <Route path="/about" element={<About />} />
  <Route path="/create" element={<CreateNew addNew={addNew} />} />
  <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
</Routes>
//...
```
* code 位於src/components/CreateNew.js如下：
```javascript
import { useField } from '../hooks'

const CreateNew = (props) => {
    const { reset: resetContent, ...content } = useField('text')
    const { reset: resetAuthor, ...author } = useField('text')
    const { reset: resetInfo, ...info } = useField('url')


    const handleSubmit = (e) => {
        e.preventDefault()
        props.addNew({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0
        })
    }

    const handleReset = (e) => {
        e.preventDefault()
        resetContent()
        resetAuthor()
        resetInfo()
    }

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input name = "content" {...content} />
                </div>
                <div>
                    author
                    <input name = "author" {...author} />
                </div>
                <div>
                    url for more info
                    <input name = "url" {...info} />
                </div>
                <button>create</button>
                <button onClick={handleReset}>reset</button>
            </form>
        </div>
    )

}
```
* 而在src/hooks的code為
```javascript
import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue("")
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}
```
### 解釋
* hooks

這段程式碼是一個自訂的 React Hook，名為 useField。它接收一個 type 參數，並返回一個物件，其中包含了一個表單欄位的狀態與相關的操作函式。

這個 Hook 使用了 React 的 useState 鉤子來管理表單欄位的值。在這裡，value 是一個狀態變數，而 setValue 是用來更新該狀態的函式。初始狀態為空字串。

onChange 函式是一個事件處理函式，當表單欄位的值改變時，它會被調用並更新狀態的值，以反映最新的輸入。

reset 函式用於重置表單欄位的值，將其設置為空字串。

最後，這個 Hook 返回了一個物件，包含了 type（接收的參數）、value（表單欄位的值）、onChange（事件處理函式）和 reset（重置函式）。這樣，使用這個 Hook 的組件可以輕鬆地管理表單欄位的狀態與相關操作。

* CreateNew.js

code中使用了展開語法（spread syntax）的目的是將從 useField 自訂的 hook 中獲得的屬性與方法，分別指派給對應的變數。

以下為展開語法的使用部分：
```javascript
const { reset: resetContent, ...content } = useField('text')
const { reset: resetAuthor, ...author } = useField('text')
const { reset: resetInfo, ...info } = useField('url')
```
這段程式碼中，useField hook 返回了一個物件，包含了 value 屬性和 onChange 方法，以及自訂的 reset 方法。展開語法的目的是將這些屬性與方法解構並分別指派給對應的變數，使其能夠在後續的表單處理中使用。

例如，resetContent 變數是 useField 返回物件中的 reset 方法，而 content 變數則是該物件中除了 reset 方法以外的所有屬性（即 value 和 onChange）。

這樣，我們可以在表單中使用 content、author 和 info 這些變數，來設置對應的輸入欄位的屬性，例如 name、value、onChange 等，以實現表單的控制和資料綁定。同時，也可以使用 resetContent、resetAuthor 和 resetInfo 來重置這些欄位的值。

## 展示單個anecdote
![](https://hackmd.io/_uploads/rJliVU5Yn.jpg)
然後
![](https://hackmd.io/_uploads/S1di48qF3.jpg)
* 首先在主path /中：

在App.js中：
```javascript
const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])
// ...

<Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
```
在components/AnecdoteList.js中
```javascript
import { Link } from "react-router-dom"

const AnecdoteList = ({ anecdotes }) => (
    <div>
        <h2>Anecdotes</h2>
        <ul>
            {anecdotes.map(anecdote =>
                <li key={anecdote.id} >
                    <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
                </li>
            )}
        </ul>
    </div>
)

export default AnecdoteList
```
可以看到AnecdoteList的功用就是將Anecdotes逐條列出
同時
```javascript
<Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
```
表示了可以點進各個anecdote中檢視
如在App.js中的這行code:
```javascript 
<Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
```
其中變數anecdote在App.js是這樣的，使用useMatch來match適合的對象
```javascript
const match = useMatch('/anecdotes/:id')

const anecdote = match
  ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
  : null
```

## create Anecdote時有個提醒
* 當我要創這個anecdote時
![](https://hackmd.io/_uploads/By6gn85Kn.jpg)
* 會跳回主path，增加anecdote時有個提醒
![](https://hackmd.io/_uploads/H1CT3I9Y2.jpg)
* 這個提醒的code設計主要來自src/components/Notification.js裡
```javascript
const Notification = ({ notification }) => {
    if (notification === null) return null

    if (notification.includes('error')) {
        return <div className="error">{notification}</div>
    }
    return <div className="success">{notification}</div>
}

export default Notification
```
* 並且設計成它會在跳轉回主頁後顯示3秒後消失：
```javascript
  // clear notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification(null)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [notification])

  const navigate = useNavigate()

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    navigate("/")
    setNotification(`A new anecdote ${anecdote.content} created`)
  }
```
# Country hook
## 首頁如此
![](https://i.imgur.com/7CoqCy2.jpg)
```javascript
const App = () => {
  const query = useField('text')
  const [ name, setName ] = useState('')
  const country = useCountry(name)
  
  const fetch = (e) => {
    e.preventDefault()
    setName(query.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        Find countries <input {...query} />
        <button>find</button>
      </form>
      <CountryData country={country}/>
    </div>
  )
}
```
fetch的功用在於使用setName將name變數以form表單傳遞，以及表單提交事件中，避免重新載入頁面

## 搜尋結果呈現如此：
![](https://i.imgur.com/fkMXCKC.jpg)
而得到資料的方法是在hook.js裡面的這段code：
```javascript
export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    console.log('effect')
    axios
      .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then(response => {
        console.log('promise fulfilled')
        setCountry(response.data[0])
      })
      .catch((error)=>{
        setCountry(null)
      })
  }, [name])

  return country
}
```
