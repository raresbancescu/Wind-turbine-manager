const mongoose = require('mongoose')
const { verificareCNP } = require('./../utils')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 1 },
  lastName: { type: String, required: true, minLength: 1 },
  company: { type: String, required: true, unique: true, minLength: 1 },
  CNP: {
    type: String,
    required: true,
    unique: true,
    length: 13,
    validate: {
      validator: (cnp) =>
        String(cnp)
          .toLocaleLowerCase()
          .match(/[0-9]{13}$/) && verificareCNP(cnp),

      message: (props) => `${props} is not a valid CNP`,
    },
  },
  mail: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: (email) =>
        String(email)
          .toLocaleLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
      message: (props) => `${props} deemed invalid by email regex`,
    },
  },
  phone: { type: String, required: true, unique: true },
  adress: String,
  birthDate: Date,
  password: { type: String, required: true },
})

module.exports = mongoose.model('User', userSchema)
