const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteLikes = (blogs) => {
  if (blogs.length === 0) return null

  const mostLiked = blogs.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  })
  return {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  }
}

const mostBlogPosts = (blogs) => {
  if (blogs.length === 0) return null
  if (blogs.length === 1){
    return {
      author: blogs[0].author,
      blogs: 1
    }
  }
  const countPosts = _.map(_.countBy(blogs, 'author'), (val, key) => ({ author: key, blogs : val }))

  const mostPosts = countPosts.reduce((prev, curr) => {
    return prev.blogs > curr.blogs ? prev : curr
  })

  return mostPosts
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  if (blogs.length === 1){
    return {
      author: blogs[0].author,
      likes: blogs[0].likes
    }
  }
  const sumLikes = _.map(_.groupBy(blogs, 'author'), (objs, key) => ({
    author: key,
    likes : _.sumBy(objs, 'likes')
  }))

  const mostLikes = sumLikes.reduce((prev, curr) => {
    return prev.likes > curr.likes ? prev : curr
  })

  return mostLikes
}

module.exports = { dummy, totalLikes, favoriteLikes, mostBlogPosts, mostLikes }