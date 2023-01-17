const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  idTurbine: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Turbine',
    required: true,
  },
  timeStamp: { type: Date, required: true, default: () => Date.now() },
})

module.exports = mongoose.model('Alert', alertSchema)
