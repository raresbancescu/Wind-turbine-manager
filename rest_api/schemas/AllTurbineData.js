const mongoose = require('mongoose')
const TurbineData = require('./TurbineData')

const allTurbineDataSchema = new mongoose.Schema({
  turbineId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Turbine',
    required: true,
    unique: true,
  },
  historicData: [TurbineData],
})

module.exports = mongoose.model('AllTurbineData', allTurbineDataSchema)
