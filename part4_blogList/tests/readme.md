# Test Note:
## 1. blog_api.test.js 
```javascript
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 100000)

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect (response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)
...
```
beforeEach表明了在執行每次的測試前都會初始化Blog，先清空，再插入初始blogs，再來，describe表明了"when there is initially some blogs saved"，下面的test都是基於這描述下，有的initially some blogs進行測試的
<hr>

```javascript
describe('addition of a new blog', () => {
  let token
  beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345', 10)
    const user = await new User({ username: 'name', passwordHash }).save()

    const userForToken = { username: 'name', id: user.id }
    return (token = jwt.sign(userForToken, config.SECRET))
  },100000)

  test ('a valid blog can be added by authorized user', async () => {
    const newBlog = {
      title: 'google search page',
      author: 'somebody',
      url: 'https://www.google.com',
      likes: 1000,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'google search page'
    )
  }, 100000)
...
```
這裡講的是添加一個blog的測試，在所有測試前，新增一個user(beforeAll)，以便之後的測試能在登入下進行新增blog的行為，這裡的測試都是有關新增blog的，比如說新增一個blog時,like數為0的測試，比如說若沒有提供title，那新增時會失敗，也就是沒有新增，要測試前後的blog長度是否一致等等...，內容都大同小異。

`剩下的為delete和put的測試，沒有比較特別的地方了`

## 2. user_api.test.js 
如同blog_api.test.js中使用到的測試語法，這裡用了類似語法

## 3. list_helper.test.js
* utils/list_helper.js
```javascript
const _ = require('lodash')
const mostBlogPosts = (blogs) => {
  if (blogs.length === 0) return null
  if (blogs.length === 1){
    return {
      author: blogs[0].author,
      blogs: 1
    }
  }
  const countPosts = _.map(_.countBy(blogs, 'author'), (val, key) => ({
    author: key,
    blogs : val
  }))

  const mostPosts = countPosts.reduce((prev, curr) => {
    return prev.blogs > curr.blogs ? prev : curr
  })

  return mostPosts
}
```
這段使用了lodash來幫助產生如何計算同一位author的文章數量list，再用reduce取出擁有最多文章數目的物件，並返回

* 可以看到在測試中，mostBlogPosts返回的形式：
```javascript
describe('author has most blogs', () => {
  test('when list is empty, the author post is null', () => {
    const result = listHelper.mostBlogPosts(listWithZeroBlog)
    expect(result).toBe(null)
  })

  test('when list has only one blog post, the author has one post', () => {
    const result = listHelper.mostBlogPosts(listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('when list has many blog posts, return the author who has most blogs', () => {
    const result = listHelper.mostBlogPosts(listWithManyBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})
```