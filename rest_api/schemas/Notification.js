const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  idBuyer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  idSeller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  idTurbine: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Turbine',
    required: true,
  },
  isOfferAccepted: {
    type: Boolean,
  },
})

module.exports = mongoose.model('Notification', notificationSchema)
