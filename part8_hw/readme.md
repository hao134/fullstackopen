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

