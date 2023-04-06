const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
  
        //const book = new Book({ ...args, author: author.id })
        const book = new Book({ ...args, author })
  
        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          })
        }
  
        // let bookData = await Book.findById(book.id).populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded : book })
        return book
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
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      }
    }
  }

  module.exports = resolvers