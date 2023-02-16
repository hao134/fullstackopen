const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url=
    `mongodb+srv://hao134:${password}@cluster0.arcsdvf.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

// const phonebook = new Phonebook({
//     name: process.argv[3],
//     number: process.argv[4]
// })

// phonebook.save().then(result => {
//     console.log('phonebook saved!')
//     mongoose.connection.close()
// })


// {} return everything match, {important: true} return only important item
Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
        console.log(phonebook)
    })
    mongoose.connection.close()
})