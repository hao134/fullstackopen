const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url=
    `mongodb+srv://hao134:${password}@cluster0.arcsdvf.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
    date: String,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'Javascript is very good not important',
//     date: new Date(),
//     important: false,
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

// {} return everything match, {important: true} return only important item
Note.find({important: false}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})