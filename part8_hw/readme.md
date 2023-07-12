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
