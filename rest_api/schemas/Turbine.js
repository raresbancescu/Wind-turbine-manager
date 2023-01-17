const mongoose = require('mongoose')

const turbineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (name) => String(name).match(/\w+/),
      message: (props) =>
        `${props} must contain only alpha numeric charachters`,
    },
  },
  constructionYear: { type: Date, required: true },
  imageLink: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  altitude: { type: Number, required: true },
  terrain: { type: String, required: true },
  suitability: { type: Number, required: true, min: 0, max: 100 },
  isPublic: { type: Boolean, required: true },
  turbineState: {
    type: String,
    required: true,
    validate: {
      validator: (state) =>
        state === 'Maintenance' || state === 'Stopped' || state === 'Running',
      message: (props) => `${props} is not a valid turbine state`,
    },
  },
})

module.exports = mongoose.model('Turbine', turbineSchema)
