const mongose = require('mongoose')

const schema = new mongose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongose.model('User', schema)