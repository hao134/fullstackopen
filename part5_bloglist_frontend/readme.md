# 首頁如此
![](https://i.imgur.com/lRmU3Fo.png)

## 按下login 和show 後會展開，而按下cancel和hide後會回復原樣，這是一個toggleable的設置。
![](https://i.imgur.com/0GsQpt6.png)

## 登入後差別在於能夠新增blog和利用put method增加likes數
![](https://i.imgur.com/jkSWM9J.png)

* 以下是首頁的設置，可切換縮放的應用寫在<Toggleable />裡面
```javascript
return (
    <div>
      <h1>Blogs App</h1>
      <p>root salainen</p>
      <Notification message={Message} />
      {!user && <div>
        <Togglable buttonLabel="log in">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <BlogShow
              key={blog.id}
              blog={blog}
            />
          ))}
      </div>
      }
      {user && <div>
        <h2>blogs</h2>
        <strong>{user.name} logged in</strong>
        <button onClick={handleLogout}>logout</button>
        <h2>create new</h2>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Togglable>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              addLikes={addLikes}
              deleteBlog={deleteBlog}
            />
          ))}
      </div>
      }
    </div>
  )
```
---

* Toggleable長這樣，一開始visible是預設false的，因此showWhenVisible是'none'的，下面的按鈕只有以hiddenWhenVisible為style的(按下去內容就可見)，而當按下按紐，則visible變成true，內容就可見了
```javascript
import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
```
而要從外部調用Toggleable裡面的子組件時，需要用forwardRef和useImperativeHandle，因此在App.js裡面可以看到addBlog裡面如何調用toggleable裡面的子組件(blogFormRef.current.toggleVisibility())，當增加blog時會同時令blogform 隱藏：
```javascript=
import { useRef } from 'react'
const blogFormRef = useRef()

const App = () => {
    //...
    const addBlog = async (title, author, url) => {
        blogFormRef.current.toggleVisibility()
        try {
          const blog = await blogService.create({
            title,
            author,
            url
          })
          setBlogs(blogs.concat(blog))
          setMessage(`A new blog ${title} by ${author} added`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        } catch (exception) {
          setMessage('error: ' + exception.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        }
      }
//...
}
```
在函數型組件中使用 forwardRef 可以將引用傳遞到函數式組件中，使其可用於引用實例。當使用 forwardRef 時，組件函數被傳遞了一個 ref 參數，這個參數需要在函數式組件中轉發，以便在其他地方引用該實例。通過使用 ref.current，可以存取組件的實例，因此 blogFormRef.current.toggleVisibility() 是在調用組件的 toggleVisibility 方法。


* login的實現方法為在window.localStorage存入登入資訊，logout時就清除window.localStorage裡的資訊：
```javascript=
const App = () => {
    //...
    useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage('error: ' + exception.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }


  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }
  //...
}
```

## 而增加的blogs以最多likes降序排列：
![](https://i.imgur.com/ayYz6uA.png)
![](https://i.imgur.com/uBTnYmh.png)
而實現的方法為用sort，對於sort方法，當返回值大於0時，代表a要排在b的後面，反之則排在前面。因此，當使用sort((a, b) => b.likes - a.likes)時，會比較每個blog的likes屬性，以b.likes - a.likes的方式比較。如果b.likes比a.likes大，則返回值大於0，代表b應該排在a的前面，因此排序結果就是降序，likes數量由高到低：
```javascript=
{blogs
  .sort((a, b) => b.likes - a.likes)
  .map(blog => (
    <Blog
      key={blog.id}
      blog={blog}
      addLikes={addLikes}
      deleteBlog={deleteBlog}
    />
))}
```