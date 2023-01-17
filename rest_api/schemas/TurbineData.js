const mongoose = require('mongoose')

const turbineDataSchema = new mongoose.Schema({
  windSpeed: { type: Number, required: true },
  turbineWear: { type: Number, required: true, min: 0, max: 10 },
  powerGenerated: { type: Number, required: true },
  eficiency: { type: Number, required: true, min: 0, max: 1 },
  timeStamp: { type: Date, required: true, default: () => Date.now() },
})

module.exports = turbineDataSchema
