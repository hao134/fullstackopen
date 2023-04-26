# Part4 Bloglist Note

* 後端連接各endpoint的情形(controllers/blogs.js)：
```javascript
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  const token = request.token

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const token =request.token
  const user = request.user
  const decodedToken = jwt.verify(token, config.SECRET)
  if(!(token && decodedToken.id)) {
    return response.status(401).json({ error: 'token invalid or missing' })
  }

  const id = request.params.id
  const blog = await Blog.findById(id)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ _id: id })
    response.sendStatus(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized operation' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const likes = request.body
  const id = request.params.id

  const updatedBlog = await Blog.findByIdAndUpdate(id, likes, { new: true })

  updatedBlog
    ? response.status(200).json(updatedBlog.toJSON())
    : response.status(404).end()
})
```
說明：可以看到除了get 和 put method外，其它的操作都是要登入後有了jwt token才能繼續操作的，另外，從這裡開始，使用了async/await這類非同步函數來處理這類異步操作

* 要能登入，要先創立user，會使用bcrypt來給輸入的password加鹽，使它在後端不易被看出原本的樣子
```javascript
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(username && password)) {
    return response.status(400).json({
      error: 'need username and password'
    })
  }

  if (username.length < 3 || password.length < 3){
    return response.status(400).json({
      error: 'username and password must at least be 3 characters'
    })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})
```

* login時，登入成功時，返回jwt token（存活時間一小時）:
```javascript
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.SECRET,{
    expiresIn : 60 * 60,
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

* 創立一些middleware程式，有印出訊息的requestLogger，有處理錯誤的(unknownEndpoint, errorHandler)，還有將訊息擷取出來讓各方使用的(tokenExtractor, userExtractor)，比如在app.js有定義：app.use('/api/blogs', middleware.userExtractor, blogsRouter)就是指收到該端點的請求時，它將使用`userExtractor`中介軟體來處理需求，`userExtractor`的作用是從請求的header中取出JWT token(如果有的話)，驗證它是否有效，然後從token中取出相應的用戶ID，將用戶ID添加到請求物件的`user`屬性中，以便稍後在請求處理程序中可以存取。然後，請求會被傳遞到`blogRouter`，並繼續被該路由處理。
```javascript
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'expired token'
    })
  }


  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()
}
```