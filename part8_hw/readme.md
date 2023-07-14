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
