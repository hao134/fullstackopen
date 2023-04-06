const mongose = require('mongoose')

const schema = new mongose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
  friendOf: [
    {
      type: mongose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
})

module.exports = mongose.model('Person', schema)