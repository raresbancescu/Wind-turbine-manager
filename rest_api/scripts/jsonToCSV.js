const {parseAsync} = require('json2csv')

const userData = {
  _id: '',
  firstName: '',
  lastName: '',
  company: '',
  CNP: '',
  mail: '',
  phone: '',
  adress: '',
  birthDate: ''
}

const turbineData = {
  _id: '',
  userId: '',
  name: '',
  constructionYear: '',
  imageLink: '',
  latitude: '',
  longitude: '',
  altitude: '',
  terrain: '',
  suitability: '',
  isPublic: '',
  turbineState: '',
}

async function objectToCSV(data, object){
    const fields = Object.keys(object)
    const opts = { fields }

    const objectCSV = await parseAsync(data, opts)
    return objectCSV
}

async function usersToCSV(users){
    const usersCSV = await objectToCSV(users, userData)
    return usersCSV
}

async function turbinesToCSV(turbines){
    const turbinesCSV = await objectToCSV(turbines, turbineData)
    return turbinesCSV
}

module.exports = { usersToCSV, turbinesToCSV }