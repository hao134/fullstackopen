# A. GraphQL-server
## Part1: The number of books and authors
* target:
![](https://i.imgur.com/hP2plJI.jpeg)


* code:
```javascript
const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID!
  }
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
  }
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length
  }
}
```
* result:
![](https://i.imgur.com/TGkQsdq.jpg)

## Part2: All books
* target:

Implement query allBooks, which returns the details of all books.
In the end, the user should be able to do the following query:
```
query {
  allBooks { 
    title 
    author
    published 
    genres
  }
}
```
* code:
在index.js
```javascript
//...
const typeDefs = `
  //...
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks: [Book!]!
  }
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allBooks: () => books,
  }
}
//...
```
* result:
![](https://i.imgur.com/ZPXNHE6.jpg)

## Part3: All authors
* target:

Implement query allAuthors, which returns the details of all authors. The response should include a field bookCount containing the number of books the author has written.

For example the query
```
query {
  allAuthors {
    name
    bookCount
  }
}
```
* code
```javascript
//...
const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  //...
  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks: [Book!]!
  }
`

const resolvers = {
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    allAuthors: () => authors,
    allBooks: () => books,
  },
  Author: {
    bookCount: (root) =>
      books.filter((book) => book.author === root.name).length
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})
```

* result:
![](https://i.imgur.com/JNrJVaO.jpg)

## Part4: Books of an author
* target:

Modify the allBooks query so that a user can give an optional parameter author. The response should include only books written by that author.

For example query
```
query {
  allBooks(author: "Robert Martin") {
    title
  }
}
```
should return
```
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code"
      },
      {
        "title": "Agile software development"
      }
    ]
  }
}
```
* code:
```javascript
//...
const typeDefs = `
  //...
  type Query {
    //...
    allBooks(author: String): [Book!]!
  }
`
const resolvers = {
  Query: {
    //...
    allBooks: (root, args) => {
        return args.author
          ? books.filter((book) => book.author === args.author)
          : books
    }
  },
  //...
}
```
* result
![](https://i.imgur.com/ZWZTc8S.jpg)

## Part5 Books by genre
* target: 

Modify the query allBooks so that a user can give an optional parameter genre. The response should include only books of that genre.

For example query
```
query {
  allBooks(genre: "refactoring") {
    title
    author
  }
}
```
should return
```
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code",
        "author": "Robert Martin"
      },
      //...
    ]
  }
}
```
* code:
```javascript
const typeDefs = `
  //...
  type Query {
    //...
    allBooks(author: String, genre: String): [Book!]!
  }
`

const resolvers = {
  Query: {
    //...
    allBooks: (root, args) => {
        if(args.author && args.genre) {
            return books.filter(
                (book) =>
                    book.author === args.author && book.genres.includes(args.genre)
            )
        }

        if (args.author) {
            return books.filter((book) => book.author === args.author)
        }
        if (args.genre) {
            return books.filter((book) => book.genres.includes(args.genre))
        }
        return books
    }
  },
  //...
}
```
* results:
![](https://i.imgur.com/8d3dCV0.jpg)
![](https://i.imgur.com/cLYPl0R.jpg)

## Part6 Adding a book
Implement mutation addBook, which can be used like this:
```
mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}
```
The mutation works even if the author is not already saved to the server:
```
mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}
```
If the author is not yet saved to the server, a new author is added to the system. The birth years of authors are not saved to the server yet, so the query
```
query {
  allAuthors {
    name
    born
    bookCount
  }
}
```
returns
```
{
  "data": {
    "allAuthors": [
      // ...
      {
        "name": "Reijo Mäki",
        "born": null,
        "bookCount": 1
      }
    ]
  }
}
```
* code:
```javascript
//...
const { v1: uuid } = require('uuid');
//...
const typeDefs = `
  //...
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
  }
`

const resolvers = {
  //...
  Mutation: {
    addBook: (root, args) => {
        const author = authors.find((author) => author.name === args.author)
        if (!author) {
            const newAuthor = {
                id: uuid(),
                name: args.author
            }
            authors = authors.concat(newAuthor)
        }

        const book = {...args, id: uuid() };
        books = books.concat(book)
        return book
    }
  },
}
//...
```
![](https://i.imgur.com/sZ3EWiZ.jpg)
![](https://i.imgur.com/3OQsnYc.jpg)

## Part7 Updating the birth year of an author

Implement mutation editAuthor, which can be used to set a birth year for an author. The mutation is used like so:
```
mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
```

If the correct author is found, the operation returns the edited author:
```
{
  "data": {
    "editAuthor": {
      "name": "Reijo Mäki",
      "born": 1958
    }
  }
}
```
If the author is not in the system, null is returned:
```
{
  "data": {
    "editAuthor": null
  }
}
```

* code
```javascript
const typeDefs = `
  //...
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
    
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
  }
`
const resolvers = {
  //...
  Mutation: {
    //...
    editAuthor: (root, args) => {
        const author = authors.find(a => a.name === args.name)
        if (!author) {
            return null
        }

        const updatedAuthor = { ...author, born: args.setBornTo }
        authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
        return updatedAuthor
    }
  },
}
```
* result:
![](https://i.imgur.com/fIB4060.jpg)
![](https://i.imgur.com/4HhPiKO.jpg)

# B. React and GraphQL
## Part8 Authors view
### target
Implement an Authors view to show the details of all authors on a page as follows:
![](https://i.imgur.com/pwOjINV.jpg)
### code
1. 首先在index.js，將要與graphql連線的套件先引用
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { 
   ApolloClient,
   ApolloProvider,
   InMemoryCache, 
} from '@apollo/client'

const client = new ApolloClient({
   uri: 'http://localhost:4000',
   cache: new InMemoryCache(),
})

 ReactDOM.createRoot(document.getElementById('root')).render(
   <ApolloProvider client={client}>
     <App />
   </ApolloProvider>
 )
```
2. 在target中描述的樣子是要切換不同button比如說book, author...來顯示不同的資訊，因此在App.js中可以這樣設計：
```javascript
import { useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
```
3. 當我們按下books的按鈕時，畫面如下，空著的原因是目前這個功能稍待之後步驟實現：
![](https://i.imgur.com/xJH4SoK.jpg)

來自components/books.js
```javascript
const Books = (props) => {
    if (!props.show) {
        return null
    }

    const books = []

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Books
```
4. 當要新增book時，按下add book的button，透過如下的表單，ㄧ樣的是新增功能要之後才實現
![](https://i.imgur.com/ke9VzWd.jpg)
```javascript
import { useState } from 'react'

const NewBook = (props) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    if (!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        console.log('add book...')

        setTitle('')
        setPublished('')
        setAuthor('')
        setGenres([])
        setGenre('')
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genres.join(' ')}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    )
}

export default NewBook
```

5. 此part實現的功能是透過查詢後端graphQL來取得author的資料，因此當按下authors的button會看到得到如下的資料：
![](https://i.imgur.com/qKBUC6E.jpg)
在/components/Authors.js
```javascript
import { useQuery } from '@apollo/client'

import { ALL_AUTHORS } from '../queries'

const Authors = (props) => {
    const result = useQuery(ALL_AUTHORS)
    if (result.loading) {
        return <div>loading...</div>
    }

    if (!props.show) {
        return null
    }
    const authors = result.data.allAuthors || []

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Authors
```
而查詢是透過queries.js
```javascript
import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
 query {
   allAuthors {
     name
     born
     bookCount
     id
   }
 }
 `
```

## Part9. Books View
### Target
Implement a Books view to show on a page all other details of all books except their genres.
![](https://i.imgur.com/fIRJbOD.jpg)
### Code
1. 首先要收集Book的資料，那麼在queries.js那邊要增加以下code
* queries.js
```javascript
//...
 export const ALL_BOOKS = gql`
 query {
    allBooks {
        title
        author
        published
        genres
        id
    }
 }
 `
```
2. 而在Books.js要引入相應的套件才能接收query來的資料
```javascript
import { useQuery } from "@apollo/client"

import { ALL_BOOKS } from "../queries"

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    if (result.loading){
        return <div>loading...</div>
    }

    if (!props.show) {
        return null
    }

    const books = result.data.allBooks || []

    //...
}

export default Books
```
### results:
![](https://i.imgur.com/SLZAfBF.jpg)

## Part10 Adding a Book
### Target:
Implement a possibility to add new books to your application. The functionality can look like this:
![](https://i.imgur.com/DLg2zv4.jpg)
### Code:
1. 首先要能對後端graphQL發出更改的請求(mutation)，一樣在queries.js那邊要增加以下code
* queries.js
```javascript
//...
 export const ADD_BOOK = gql`
 mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
    ) {
        title
        author
        published
        genres
        id
    }
 }
 `
```
2. 而在/components/NEWBOOK.js也一樣要增加相對應的code
```javascript
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
    //...

    const [ addBook ] = useMutation(ADD_BOOK, {
        refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]
    })

    //...

    const submit = async (event) => {
        event.preventDefault()

        addBook({ variables: { title, author, published: parseInt(published), genres }})

        //...
    }
    //...
}

export default NewBook
```
### Results:
* 增加這本書的資料
![](https://i.imgur.com/2Tcm6Nv.jpg)
* 按下create book後，到books區看，會看到增加的資料(最後一筆)
![](https://i.imgur.com/XjvH50J.jpg)
* 到authors區看也會看到新增的作者資料
![](https://i.imgur.com/EWZRoER.jpg)

## Part11 Authors birth year
### Target
Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view:
![](https://i.imgur.com/cQRLM7r.jpg)
Make sure that the Authors view is kept up to date after setting a birth year.
### Code
1. 首先要能對後端graphQL發出更改的請求(mutation)，一樣在queries.js那邊要增加以下code
* queries.js
```javascript
//...
export const EDIT_AUTHOR = gql`
   mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
        name
        born
    }
   }
 `
```
2. 要發出改變和接收改變後的訊息，在/components/Authors.js也一樣要增加相對應的code
```javascript
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
    const [name, setName] = useState('')
    const [birth, setBirth] = useState('')

    const [ changeBirth ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    const submit = (event) => {
        event.preventDefault()
        changeBirth({ variables: { name, setBornTo: parseInt(birth) }})

        setName('')
        setBirth('')
    }

    //...

    return (
        <div>
            //...

            <h2>Set BirthYear</h2>
            <form onSubmit={submit}>
                <div>
                    name <input
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                         />
                </div>
                <div>
                    born <input
                        type="number"
                        value={birth}
                        onChange={({ target }) => setBirth(target.value)}
                        />
                </div>
                <button type="submit">update author</button>
                
            </form>
        </div>
    )
}

export default Authors
```
### Results
* 假設要修改Sandi Metz的年齡
![](https://i.imgur.com/gyuQyqm.jpg)
* 按下update author後可以看到已經修改了
![](https://i.imgur.com/HtsFvtW.jpg)
## Part12 Authors birth year advanced
### Target
Change the birth year form so that a birth year can be set only for an existing author. Use select tag, react select, or some other mechanism.

A solution using the react select library looks as follows:
![](https://i.imgur.com/jq1mJCC.jpg)
### Code
1. 我選擇使用react-select，所以首先下載[react-select](https://www.npmjs.com/package/react-select)
2. 再來是將更改作者年齡的部分分離出去在SetBirthYear.js，大部分同上，只有增加react-select的部分有點不同，code如下
* SetBirthYear.js
```javascript
import { useState } from "react";
import { useMutation } from "@apollo/client";
import Select from 'react-select';

import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const SetBirthYear = ({ authors }) => {
    const [name, setName] = useState('')
    const [birth, setBirth] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)

    const [ changeBirth ] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    const submit = (event) => {
        event.preventDefault()
        changeBirth({ variables: { name, setBornTo: parseInt(birth) }})

        setName('')
        setBirth('')
    }
    const options = authors.map(item => {
        return {
            value: item.name,
            label: item.name
        }
    })

    const handleSelect = (selectedOption) => {
        setSelectedOption(selectedOption)
        setName(selectedOption.value)
    }

    return (
        <div>
            <h2>Set BirthYear</h2>
            <form onSubmit={submit}>
                <div>
                    <Select
                      value={selectedOption}
                      onChange={handleSelect}
                      options={options}
                    />
                </div>
                <div>
                    born <input
                      type="number"
                      value={birth}
                      onChange={({ target }) => setBirth(target.value)}
                    />
                </div>
                <button type="submit">update author</button>

            </form>
        </div>
    )
}

export default SetBirthYear
```
3. 而原本被抽離的Authors.js，則只要記得引入SetBirthYear.js就好了
* Authors.js
```javascript
import { useQuery } from '@apollo/client'
import SetBirthYear from './SetBirthYear'

import { ALL_AUTHORS } from '../queries'

const Authors = (props) => {
    const result = useQuery(ALL_AUTHORS)
    if (result.loading) {
        return <div>loading...</div>
    }

    if (!props.show) {
        return null
    }
    const authors = result.data.allAuthors || []

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.id}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <SetBirthYear authors={authors}/>
        </div>
    )
}

export default Authors
```
### Results
* 首先選擇Joshua Kerievsky，將原本的出生年1990改成1980
![](https://i.imgur.com/gUPWdXg.jpg)

---

![](https://i.imgur.com/0Ab8g4u.jpg)
* 可以看到按下button後出生年已經改變成1980了
![](https://i.imgur.com/bxsxBUV.jpg)

# C. Database and user administration
## Part13, 14, 15, change the database to mongoDB
### Target
這個步驟是更新後端的code，將原本存在index.js裡的資料，存在mongoDB裡面，這樣做的好處是透過後端更新code時能夠永久記住資料，不會在下次啟動後端時遺失資料。
### Code
1. 先安裝套件：
```
npm install mongoose dotenv
```
2. 在server/models裡，增加mongoDB的model，裡面定義了對author和book這兩個資料集的schema
* author.js
```javascript
const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    born: {
        type: Number,
    },
})

module.exports = mongoose.model('Author', schema)
```
* book.js
```javascript
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    published: {
        type: Number,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        red: 'Author'
    },
    genres: [{ type: String }]
})

module.exports = mongoose.model('Book', schema)
```
* 以下操作都在index.js裡

3. 引入mongoose套件並完成基本設定：
```javascript
//...
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })
//...
```
4. 更改typeDefs，更動的地方請見註解，理由來自文中(so that instead of just the author's name, the book object contains all the details of the author. You can assume that the user will not try to add faulty books or authors, so you don't have to care about validation errors.)
```javascript
const typeDefs = `
  //...
  type Book {
    title: String!
    author: Author!   // String! -> Author!
    //...
    id: ID!
  }
  //...
  type Mutation {
    addBook(
      //...
    ): Book!          // Book -> Book!

    //...
  }
`
```

5. (part13)resolvers，暫且修改成如此，計數的部分由mongoose提供的countDocuments()計，而下面的addBook則是使後端能增加book的資料
```javascript
const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allAuthors: async (root, args) => {
      return Author.find({})
    },
    //...

  },
  //...
  Mutation:{
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author){
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author.id })
      return book.save()
    },
    //...
  },
}
```
6. (part14)resolvers，繼續修改，在Query部分實現allBooks的query，Author部分的bookCount，還有更改(Mutation)部分的editAuthor
```javascript
const resolvers = {
  Query: {
    //...
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        const books = await Book.find({
          $and: [
            { author: { $in: author.id }},
            { genres: { $in: args.genre }}
          ]
        }).populate('author')

        return books
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        const books = await Book.find({ author: { $in: author.id }}).populate('author')
        
        return books
      }

      if (args.genre) {
        const books = await Book.find({ genres: { $in: args.genre }}).populate('author')
        return books
      }
      return await Book.find({}).populate('author')
    }

  },
  Author: {
    bookCount: async (root) =>
      await Book.find({ author: root.id }).countDocuments(),
  },
  Mutation:{
    //...
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) return null

      const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
      )
      
      return updatedAuthor
    }
  },
}
```
* 解釋：

在默認情況下，當我們執行 Book.find({}) 查詢時，author 字段僅包含對 Author 模型中文檔的引用，而不是實際的 Author 文檔。

使用 populate('author') 方法可以告訴 Mongoose 將 author 字段的引用替換為實際的 Author 文檔。這樣，查詢結果中的 author 字段將包含完整的 Author 文檔對象，而不僅僅是引用。

通過執行 populate 方法，我們可以輕鬆地在查詢結果中獲取關聯文檔的詳細信息，而不必額外進行查詢。這對於處理關聯數據非常方便，可以避免多次查詢數據庫。

7. (part15)根據這步驟的指示是要我們完善程式，使得資料庫驗證錯誤（例如書籍標題或作者名稱過短）能夠合理地處理。這意味著它們會拋出一個適當的錯誤訊息的 GraphQLError。要修改的部分即是新增及修改諸如此類會更改到資料庫的動作
```javascript
//...
//先引入GraphQLError
const { GraphQLError } = require('graphql')
//...
const resolvers = {
  //...
  Mutation:{
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author){
        author = new Author({ name: args.author })

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          })
        }
      }

      const book = new Book({ ...args, author: author.id })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args,
          error
        })
      }

      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) return null

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          code: 'BAD_USER_INPUT',
          invalidArgs: args,
          error
        })
      }

      return author
    }
  },
}
```
### Result
* 在apollo server中新增以下一筆book資料
![](https://i.imgur.com/8lS3IY5.jpg)
* 在mongoDB頁面中可以看到成功新增資料：
![](https://i.imgur.com/A4Ud9Iu.jpg)

## Part16 user and logging in
### Target
Add user management to your application. Expand the schema like so:
```javascript
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```
Create resolvers for query me and the new mutations createUser and login. Like in the course material, you can assume all users have the same hardcoded password.

Make the mutations addBook and editAuthor possible only if the request includes a valid token.

### Code
1. 一樣先新增User的schema在server/models/
* user.js
```javascript
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    favoriteGenre: {
        type: String,
    },
})

module.exports = mongoose.model('User', schema)
```
#### 之後的更改一樣都在index.js
2. 先安裝[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)，引入jsonwebtoken還有user model
```javascript
//...
//require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('./models/user')
//...
```
3. typeDefs也要有一些相對應的更改，新增user和login的定義：
```javascript
const typeDefs = `
  //...
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    //...
    me: User
  }
  type Mutation {
    //...

    editAuthor(
      //...
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`
```

3. 再來是resolver part，要改變的部分包括
* 增加me的Query
* 對於新增和編輯書本的操作要求登入身份
* 增加使用者和login的功能
```javascript
//...
const resolvers = {
  Query: {
    //...
    allBooks: async (root, args) => {
      //...
    },
    me: (root, args, context) => {
      return context.currentUser
    }

  },
  //...
  Mutation:{
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      //...
    },
    editAuthor: async (root, args, {currentUser}) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      //...
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'  
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
}
```

4. 最後一步是要驗證jwt token，若符合則返回currentuser以供之後的更改操作
```javascript
//...
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null 
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET  
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```
### Result

* 首先嘗試像以前一樣新增一筆資料(真夏方程式)，會發現錯誤訊息(not authenticated)
![](https://i.imgur.com/V8NMR8J.jpg)
* 解決方法是先創立一個使用者(密碼固定為secret)
![](https://i.imgur.com/ogk7NKE.jpg)
* 登入以獲得jwt token
![](https://i.imgur.com/oK7lo8J.jpg)
* 將獲得的jwt token加入到Headers
![](https://i.imgur.com/UlMJFyR.jpg)
* 可以發現新增功能如常運作了
![](https://i.imgur.com/ZqkA3BT.jpg)

# d. Login and updating the cache & e. Fragments and subscriptions
## Part17 Listing Books
### Target
After the backend changes, the list of books does not work anymore. Fix it.
* 原本的頁面在顯示authors時：
![](https://i.imgur.com/hWKRKcZ.jpg)
* 當顯示books的時候：
![](https://i.imgur.com/LwFbNIi.jpg)
### Code
* 會有這樣的錯誤應該是後端原本是參照author的name，但改為參照author的全部資料，而前端並未做相對應的修改，而發生如上的錯誤
![](https://i.imgur.com/NmUL0ar.jpg)

因此修改方法為在
* client/src/components/Books.js裡修改為只要map author資料裡面的name
![](https://i.imgur.com/RDHsK8n.jpg)
* client/src/components/queries.js 一樣修改為author的name
![](https://i.imgur.com/6FO3PSY.jpg)
### Result
books 可以正常顯示了
![](https://i.imgur.com/AX0mQOW.jpg)

## Part18 Log in
### Target
原本我們已經在後端實現了實名修改功能，但是前端還沒有實現，因此此時更改資訊時會出現錯誤
![](https://i.imgur.com/5iDjqAg.jpg)
按下update author後，出現not authenticated的錯誤
![](https://i.imgur.com/o8SK6t2.jpg)
因此要實作login功能
### Code
1. 首先，要有新的query，當然要在queries.js中新增
* queries.js
```javascript
//...
 export const LOGIN = gql`
   mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
   }
 `
```

2. 實現Login頁面，當表單提交帳號名稱和密碼時，後端會回傳jwt token，觸發useEffect將token存在localStorage以供登入使用。
```javascript
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from '../queries'

const LoginForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const [ login, result ] = useMutation(LOGIN)

    useEffect(() => {
        if ( result.data ) {
            const token = result.data.login.value
            props.setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result.data]) // eslint-disable-line

    const submit = async (event) => {
        event.preventDefault()

        login({ variables: {username, password} })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input
                      value = {username}
                      onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password <input
                      type="password"
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm
```

3. index.js也要稍改一下，將jwt token加入headers才能維持登入
* index.js
```javascript
import React from 'react'
 import ReactDOM from 'react-dom/client'
 import App from './App'
 import { 
   ApolloClient,
   ApolloProvider,
   InMemoryCache, 
   createHttpLink
 } from '@apollo/client'
 import { setContext } from '@apollo/client/link/context'

 const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
 })

 const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
 })

 const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(),
 })

 ReactDOM.createRoot(document.getElementById('root')).render(
   <ApolloProvider client={client}>
     <App />
   </ApolloProvider>
 )

```
4. 主要頁面也要重整一下，當未登入時顯示登入功能，而登入時顯示登出功能
* App.js
```javascript
import { useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  if (!token){
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>

        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <LoginForm show={page === 'login'} setToken={setToken} />
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
```

### Result
* 未登入時，需要登入
![](https://i.imgur.com/dTPpNU9.jpg)
* 登入後，原本的login改為logout，且可以新增資料了
![](https://i.imgur.com/BwJfKRB.jpg)

## Part19 Books by genre, part 1
### Target
Complete your application to filter the book list by genre. Your solution might look something like this:
![](https://i.imgur.com/tB60YUQ.jpg)
### Code
在這一步驟中，我用了[material UI](https://mui.com/material-ui/getting-started/installation/)來優化介面，但這不是這個步驟的重點，重點是上面target所述針對不同genre分類，因此我直接寫出完成這個重點的code
* client/src/components/Books.js
```javascript
//...
const Books = (props) => {
    const [genre, setGenre] = useState('all')
    const result = useQuery(ALL_BOOKS)
    if (result.loading){
        return <div>loading...</div>
    }

    if (!props.show) {
        return null
    }

    const books = result.data.allBooks || []

    // Get only unique genres
    const genres = [...new Set(books.flatMap((book) => book.genres))]

    return (
        <div>
            <h2>books</h2>

            <p>
                in genre <strong>{genre}</strong>
            </p>
            <div>
                {genres.map((genre) => (
                    <button key={genre} onClick={() => setGenre(genre)}>
                      {genre}
                    </button>
                ))}
                <button onClick={() => setGenre('all')}>show all</button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books
                        .filter((b) => (genre !== 'all' ? b.genres.includes(genre) : b))
                        .map((b) => (
                            <TableRow key={b.id}>
                                <TableCell>{b.title}</TableCell>
                                <TableCell>{b.author.name}</TableCell>
                                <TableCell>{b.published}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Books
```
大部分的code並不難理解，主要需要講的是第16行的code
```javascript
const genres = [...new Set(books.flatMap((book) => book.genres))]
```
1. books.flatMap((book) => book.genres): 使用 flatMap 方法對 books 數組進行扁平化操作，將每本書的 genres 數組提取出來並合併為一個扁平化的數組。例如，如果有兩本書，第一本書的 genres 是 ['Fantasy', 'Adventure']，第二本書的 genres 是 ['Sci-Fi', 'Mystery']，那麼該操作將返回 ['Fantasy', 'Adventure', 'Sci-Fi', 'Mystery']。

2. [...new Set(array)]: 使用 Set 對象將數組轉換為一組唯一的值，消除重複的元素。 Set 是 JavaScript 中的一種數據結構，它只存儲唯一的值。通過使用 Set 構造函數將數組轉換為 Set 對象，然後使用擴展運算符 ... 將其轉換回數組形式。這樣做可以去除重複的元素。

綜合起來，給定的代碼將提取 books 數組中所有書籍的流派（genres），並創建一個不重複的流派數組。例如，如果 books 數組中有三本書，每本書的流派分別為 ['Fantasy', 'Adventure']、['Sci-Fi', 'Mystery'] 和 ['Fantasy']，那麼最終的 genres 數組將是 ['Fantasy', 'Adventure', 'Sci-Fi', 'Mystery']。

### Result
* 預設是顯示所有genres
![](https://i.imgur.com/wAMbWri.jpg)
* 但如果按下genre為crime的按鈕，則只有顯示genre為crime的書籍
![](https://i.imgur.com/xDuGNTB.jpg)

## Part20 Books by genre, part 2
### Target
Implement a view which shows all the books based on the logged-in user's favourite genre.
![](https://i.imgur.com/4kulsrk.jpg)
### Code
1. 如同前面的步驟，要從資料庫中獲得user的資訊，要在queries.js中定義新的query
* queries.js
```javascript
export const USER = gql`
  query {
   me {
     username
     favoriteGenre
   }
  }
`
```
2. 接下來定義新的分頁，比如說我喜歡genre為crime的，在此Recommand頁面它就會推薦我genre為crime的書的資料，而假如沒有crime這個genre的話，那它就顯示在此genre沒有書籍資料。
* /client/src/components/Recommend.js
```javascript 
import { useQuery } from "@apollo/client";
import { USER, ALL_BOOKS } from "../queries"

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TableHead,
} from "@mui/material"

const Recommend = (props) => {
    const user = useQuery(USER)
    const books = useQuery(ALL_BOOKS)

    if (!props.show) {
        return null
    }

    if (user.loading || books.loading) {
        return <div>loading...</div>
    }

    const { favoriteGenre } = user.data.me 
    const { allBooks } = books.data 

    const bookRecommendations = allBooks.filter((book) =>
        book.genres.includes(favoriteGenre)
    )

    return (
        <div>
            <h2>recommandations</h2>
            {bookRecommendations.length > 0 ? (
                <div>
                    <p>
                        books in your favorite genre <strong>{favoriteGenre}</strong>
                    </p>
                    <TableContainer component={Paper}>
                      <Table>
                      <TableHead>
                        <TableRow>
                            <TableCell>title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Published</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {bookRecommendations
                        .map((book, i) => (
                          <TableRow key={i}>
                            <TableCell>{book.title}</TableCell>
                            <TableCell>{book.author.name}</TableCell>
                            <TableCell>{book.published}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </TableContainer>
                </div>
            ):(
                <p>
                    No books have been added yet based on your favorite genre{" "}
                    <strong>{favoriteGenre}</strong>
                </p>
            )}
        </div>
    )
}

export default Recommend
```

3. 在主頁面中顯示Recommend頁面，且要登入時才有顯示
![](https://i.imgur.com/E9yTDGE.jpg)

### Result
* 在尚未登入時沒有Recommend頁面
![](https://i.imgur.com/TtKpemb.jpg)
* 而在登入後就可以看到Recommend頁面
![](https://i.imgur.com/cq5RoHB.jpg)

## Part23 Subscriptions - server
### Target
Do a backend implementation for subscription bookAdded, which returns the details of all new books to its subscribers.
### Code
1. Refactor the Backend，將index.js裡面的resolver和schema分離出去，還有使用expressMiddleware取代原本的startStandaloneServer來實現訂閱功能
* index.js
```javascript
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const express = require('express')
const cors = require('cors')
const http = require('http')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      }
    })
  )
  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}
start()
```
* resolvers.js
```javascript
const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
      authorCount: async () => Author.collection.countDocuments(),
      bookCount: async () => Book.collection.countDocuments(),
      allAuthors: async (root, args) => {
        return Author.find({})
      },
      allBooks: async (root, args) => {
        if (args.author && args.genre) {
          const author = await Author.findOne({ name: args.author })
          const books = await Book.find({
            $and: [
              { author: { $in: author.id }},
              { genres: { $in: args.genre }}
            ]
          }).populate('author')
  
          return books
        }
  
        if (args.author) {
          const author = await Author.findOne({ name: args.author })
          const books = await Book.find({ author: { $in: author.id }}).populate('author')
          
          return books
        }
  
        if (args.genre) {
          const books = await Book.find({ genres: { $in: args.genre }}).populate('author')
          return books
        }
        return await Book.find({}).populate('author')
      },
      me: (root, args, context) => {
        return context.currentUser
      }
  
    },
    Author: {
      bookCount: async (root) =>
        await Book.find({ author: root.id }).countDocuments(),
    },
    Mutation:{
      addBook: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        
        let author = await Author.findOne({ name: args.author })
  
        if (!author){
          author = new Author({ name: args.author })
  
          try {
            await author.save()
          } catch (error) {
            throw new GraphQLError('Saving author failed', {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            })
          }
        }
  
        const book = new Book({ ...args, author: author.id })
  
        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          })
        }
  
        let bookData = await Book.findById(book.id).populate('author')
        console.log(bookData)
        return bookData
      },
      editAuthor: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        const author = await Author.findOne({ name: args.name })
  
        if (!author) return null
  
        author.born = args.setBornTo
  
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Updating author failed', {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          })
        }
  
        return author
      },
      createUser: async (root, args) => {
        const user = new User({ ...args })
  
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        }
  
        const userForToken = {
          username: user.username,
          id: user._id,
        }
        
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
    },
  }

  module.exports = resolvers
```
* schema.js
```javascript
const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type AuthorData {
    name: String!
    id: ID!
  }
  type BookData {
    title: String!
    author: AuthorData!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): BookData!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

module.exports = typeDefs
```
2. 安裝需要的套件
```
npm install express cors
npm install graphql-ws ws @graphql-tools/schema
npm install graphql-subscriptions
```
3. 透過websocket實現訂閱
* index.js
```javascript
//...
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

//...

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          }
        }
      }
    ],
  })

  await server.start()

  //...
}
start()
```
* resolvers.js
![](https://i.imgur.com/oeSxyaI.jpg)

---

![](https://i.imgur.com/8r51Jm7.jpg)
* schema.js
```javascript
//...
type Subscription {
  bookAdded: Book!
}
```
### Result
* 按下subscription
![](https://i.imgur.com/PSkYYRJ.jpg)
* 右下角開始訂閱：
![](https://i.imgur.com/nISGPXU.jpg)
* 可以看到新增兩筆資料，右下角就紀錄這兩筆
![](https://i.imgur.com/Sb1nfnk.jpg)

## Part24&25 Subscriptions - client
### Target
Start using subscriptions in the client, and subscribe to bookAdded. When new books are added, notify the user. Any method works. For example, you can use the window.alert function.

Keep the application's book view updated when the server notifies about new books (you can ignore the author view!). You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.

### Code
1. 先安裝需要的套件
```
npm install graphql-ws 
```
2. index.js
In order to use subscriptions in our React application, we have to do some changes, especially to its configuration. The configuration in index.js has to be modified like so:
* client/src/index.js
```javascript
import React from 'react'
 import ReactDOM from 'react-dom/client'
 import App from './App'
 import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, split
 } from '@apollo/client'
 import { setContext } from '@apollo/client/link/context'

 import { getMainDefinition } from '@apollo/client/utilities'
 import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
 import { createClient } from 'graphql-ws'

 const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
 })

 const httpLink = createHttpLink({ uri: 'http://localhost:4000' })

 const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
 )

 const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
 )

 const client = new ApolloClient({
   cache: new InMemoryCache(),
   link: splitLink
 })

 ReactDOM.createRoot(document.getElementById('root')).render(
   <ApolloProvider client={client}>
     <App />
   </ApolloProvider>
 )

```
The new configuration is due to the fact that the application must have an HTTP connection as well as a WebSocket connection to the GraphQL server.
```
const httpLink = createHttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
)
```

3. 同時實作query的fragments和subscription的query，因此queries.js改成這樣
* queries.js
![](https://i.imgur.com/6k3pHBs.jpg)

---

![](https://i.imgur.com/q9s8tVT.jpg)

4. App.js 中subscription
```javascript
import { useState, useEffect } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription } from '@apollo/client'
import { Button } from "@mui/material";
import { ALL_BOOKS, BOOK_ADDED } from './queries'


export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [message, setMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded 
      setMessage(`${addedBook.title} added`)

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  useEffect(() => {
    const userFromStorage = localStorage.getItem('library-user-token')
    if (userFromStorage) {
      setToken(userFromStorage)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [message])

  if (!token){
    return (
      <div>
        <div>
          <Button onClick={() => setPage('authors')}>authors</Button>
          <Button onClick={() => setPage('books')}>books</Button>
          <Button onClick={() => setPage('login')}>login</Button>
        </div>

        <Notify message={message} />
        <Authors show={page === 'authors'} setError={setMessage} />

        <Books show={page === 'books'} />

        <LoginForm show={page === 'login'} setToken={setToken} setError={setMessage}/>
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <Button onClick={() => setPage('authors')}>authors</Button>
        <Button onClick={() => setPage('books')}>books</Button>
        <Button onClick={() => setPage('add')}>add book</Button>
        <Button onClick={() => setPage('recommend')}>recommend</Button>
        <Button onClick={logout}>logout</Button>
      </div>

      <Notify message={message} />
      <Authors show={page === 'authors'} setError={setMessage}/>

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setError={setMessage}/>

      <Recommend show={page === 'recommend'} />
    </div>
  )
}

export default App
```

4. 同時實作query的fragments和subscription的query，因此queries.js改成這樣
* queries.js
![](https://i.imgur.com/6k3pHBs.jpg)

---

![](https://i.imgur.com/q9s8tVT.jpg)

### Result
可以開兩個分頁，當其中一個分頁新增資料時，另一個分頁也會更新頁面

## Part 21&22 books by genre with GraphQL & Up-to-date cache and book recommendations
### Target
In the previous two exercises, the filtering could have been done using just React. To complete this exercise, you should redo the filtering the books based on a selected genre (that was done in exercise 8.19) using a GraphQL query to the server. If you already did so then you do not have to do anything.

If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated at least when a genre selection button is pressed.

When new genre selection is not done, the view does not have to be updated.

### Code
簡單來說，原本由前端來分類不同的genre，變成由後端來分類，前端負責顯示，如下圖所示，原本由前端分類的改為單純的books資料，而books資料是使用useLazyQuery藉由外部動作後才去query得到的，具體如何實現請往下看
![](https://i.imgur.com/aW0rpRz.jpg)
* queries.js
1. 加入參數使得query allBooks能以genre當作參數來query
![](https://i.imgur.com/GkOQ4yo.jpg)
* Books.js
1. 首先，引入useLazyQuery和useEffect
![](https://i.imgur.com/kCkcThT.jpg)
2. 由於我在後端的設計沒有genre為'all'的分類，因此在這分為兩種資料，得到all資料的result和能由外部進行查詢的genreResult資料
![](https://i.imgur.com/ORFWZCh.jpg)
```
const [getBooksByGenre, genreResult] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: 'no-cache'
})
```
useLazyQuery 使用了 ALL_BOOKS 查詢以及 { fetchPolicy: 'no-cache' } 選項。fetchPolicy: 'no-cache' 表示每次執行查詢時都將跳過緩存，並從服務器獲取最新的數據。
這行程式碼使用 useLazyQuery 創建了一個可手動觸發的查詢函數 getBooksByGenre，並初始化了 genreResult 作為查詢的狀態和數據容器。

3. handleGenreClick作為切換不同genre的函式
![](https://i.imgur.com/vcSw0WQ.jpg)

4. 按下按鈕後，books的資料就會query為該種按鈕代表的genre的資料
![](https://i.imgur.com/YVpTu91.jpg)

* Recommand.js
大部分和上面相同，即是由原本的由前端處理的分類改為由後端處理，比較特別的是這段
```javascript
    useEffect(() => {
        if (user.data) {
            setFavoriteGenre(user?.data?.me?.favoriteGenre)
            getBooks({ variables: { genre: favoriteGenre } })
        }
    }, [user.data, favoriteGenre, getBooks])
```
當 user.data 發生變化時，useEffect 會執行其中的回調函數。在這個回調函數中，它檢查 user.data 是否存在。如果存在，它會使用 setFavoriteGenre 函數將 user.data.me.favoriteGenre 的值設置為 favoriteGenre 狀態變數。然後，它調用 getBooks 函數，並將 { genre: favoriteGenre } 作為參數傳遞給該函數，以觸發書籍查詢。

在這個例子中，useEffect 的目的是在 user.data 變化時，根據用戶的喜愛類型 (favoriteGenre) 來執行書籍查詢。它確保每當 user.data 或 favoriteGenre 發生變化時，都會觸發一次新的書籍查詢。

需要注意的是，getBooks 函數是從 useLazyQuery hook 中獲取的，而不是從 useQuery。這是因為 useLazyQuery 提供了手動觸發查詢的能力，而 useQuery 則是自動執行查詢。在這個情境中，我們希望在 user.data 變化時手動觸發書籍查詢，因此使用了 useLazyQuery。

## Part26 n+1
### Target
Solve the n+1 problem of the following query using any method you like.
```
query {
  allAuthors {
    name 
    bookCount
  }
}
```
### Code
1. 去掉多餘的查詢
要解決這個問題，本來在server/resolvers.js裡的
```javascript
Author: {
  bookCount: async ({ books }) => books.length
},
```
要去掉，因為這個就是會造成n+1 problems裡的n次query的來源

2. 在author的model schema加入book的schema
* server/model/author.js
```javascript
const schema = new mongoose.Schema({
    //...
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }
    ]
})
```
3. 在resolver.js裡的allAuthors的query要改變
* server/resolver.js
```javascript
const resolvers = {
    Query: {
      //...
      allAuthors: async () => {
        const authors = await Author.find({});
        const allAuthors = authors.map((author) => {
          return {
            name: author.name,
            born: author.born,
            bookCount: author.books.length,
            id: author._id,
          };
        });
        return allAuthors;
      },
      //...
```
這樣就可以避免掉n+1 problem了
