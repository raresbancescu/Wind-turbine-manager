const mongoose = require('mongoose')
const md5 = require('md5')
const {
  extractDateFromCNP,
  getRequestData,
  validateJSON,
} = require('./../utils')
const User = require('./../schemas/User')
const Notification = require('./../schemas/Notification')
const Alert = require('./../schemas/Alert')
const Turbine = require('./../schemas/Turbine')
const { helperDeleteTurbineRelatedData } = require('./TurbineController')
const {usersToCSV} = require('./../scripts/jsonToCSV')

// @desc    Gets All Users
// @route   GET /api/users
async function getUsers(req, res) {
  try {
    const users = await User.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(users))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets All Users in csv format without password information
// @route   GET /api/users/csv
async function getUsersCSV(req, res) {
  try {
    const users = await User.find()
    const csvUsers = await usersToCSV(users)
    res.writeHead(200, { 'Content-Type': 'text/csv' })
    res.end(csvUsers)
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets user by id
// @route   GET /api/users/:id
async function getUser(req, res, id) {
  try {
    const user = await User.findById(id)
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} not found` }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets user by mail
// @route   GET /api/users/mail/:mail
async function getUserByMail(req, res, mail) {
  try {
    const decodedMail = decodeURIComponent(mail)
    const user = await User.findOne({ mail: decodedMail })
    if (user) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      res.end(JSON.stringify(user))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ message: `User with mail ${decodedMail} not found` })
      )
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets data for user if mail and password correct
// @route   GET /api/users/login/:mail/:password
async function userLogin(req, res, mail, password) {
  try {
    const decodedMail = decodeURIComponent(mail)
    const user = await User.findOne({ mail: decodedMail })
    if (user && user.password === md5(password)) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
      })
      res.end(JSON.stringify(user))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `User with mail ${decodedMail} not found or wrong password`,
        })
      )
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets All notifications
// @route   GET /api/users/notifications
async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(notifications))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets All alerts
// @route   GET /api/users/alerts
async function getAlerts(req, res) {
  try {
    const alerts = await Alert.find()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(alerts))
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets the notifications of user identified by id
// @route   GET /api/users/:id/notifications
async function getUserNotifications(req, res, id) {
  try {
    const user = await User.findById(id)
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} not found` }))
    } else {
      const notifications = await Notification.find({
        $or: [{ idBuyer: id }, { idSeller: id }],
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(notifications))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    Gets the alerts of user identified by id
// @route   GET /api/users/:id/alerts
async function getUserAlerts(req, res, id) {
  try {
    const user = await User.findById(id)
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} not found` }))
    } else {
      const alerts = await Alert.where('idUser').equals(id)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(alerts))
    }
  } catch (error) {
    console.log(error)
  }
}

//POST

// @desc    POSTS a new user
// @route   POST /api/users
async function createUser(req, res) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const { firstName, lastName, company, CNP, mail, phone, adress, password } =
      jsonBody

    try {
      const user = await User.create({
        firstName,
        lastName,
        company,
        CNP,
        mail,
        phone,
        adress,
        birthDate: extractDateFromCNP(CNP),
        password: md5(password),
      })

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    POSTS a new notification
// @route   POST /api/users/notifications
async function createNotification(req, res) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const { idBuyer, idSeller, idTurbine } = jsonBody

    const buyer = await User.findById(idBuyer)
    const seller = await User.findById(idSeller)
    const turbine = await Turbine.findById(idTurbine)

    const noBuyer = buyer === null
    const noSeller = seller === null
    const noTurbine = turbine === null

    if (
      noBuyer ||
      noSeller ||
      noTurbine ||
      !seller._id.equals(turbine.userId)
    ) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      const response = { message: '' }
      if (noBuyer) {
        response.message = `The buyer's id ${idBuyer} doesn't exist in the database`
      } else if (noSeller) {
        response.message = `The user's id ${idSeller} doesn't exist in the database`
      } else if (noTurbine) {
        response.message = `The turbine with id ${idSeller} doesn't exist in the database`
      } else {
        response.message = `The seller with id ${idSeller} doens't own the turbine ${idTurbine}`
      }
      res.end(JSON.stringify(response))

      return
    }

    try {
      const notification = await Notification.create({
        idBuyer,
        idSeller,
        idTurbine,
      })

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(notification))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    POSTS a new alert
// @route   POST /api/users/alerts
async function createAlert(req, res) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const { idUser, idTurbine, timestamp } = jsonBody

    const user = await User.findById(idUser)
    const turbine = await Turbine.findById(idTurbine)

    const noUser = user === null
    const noTurbine = turbine === null

    if (noUser || noTurbine || !user._id.equals(turbine.userId)) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      const response = { message: '' }
      if (noUser) {
        response.message = `The user's id ${idUser} doesn't exist in the database`
      } else if (noTurbine) {
        response.message = `The turbine with id ${idTurbine} doesn't exist in the database`
      } else {
        response.message = `The user with id ${idUser} doens't own the turbine ${idTurbine}`
      }
      res.end(JSON.stringify(response))
      return
    }

    try {
      const alert = await Alert.create({
        idUser,
        idTurbine,
        timestamp,
      })

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(alert))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

// @desc    UPDATES a user
// @route   PUT /api/users/:id

async function updateUser(req, res, id) {
  try {
    const textBody = await getRequestData(req)
    const jsonBody = validateJSON(textBody)

    if (!jsonBody) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Invalid request JSON' }))
      return
    }

    const user = await User.findById(id)

    if (user == null) {
      res.writeHead(422, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          message: `User with id ${id} doesn't exist in the database`,
        })
      )
      return
    }

    try {
      for (prop in user) {
        user[prop] = jsonBody[prop] ?? user[prop]
      }

      user.birthDate = extractDateFromCNP(user.CNP)
      user.password=md5(user.password);
      await user.save()

      res.writeHead(201, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: error.message }))
    }
  } catch (error) {
    console.log(error)
  }
}

//DELETE

// @desc    Deletes a user
// @route   DELETE /api/users/:id
async function deleteUser(req, res, id) {
  try {
    const user = await User.findById(id)

    if (user) {
      const turbines = await Turbine.find({ userId: id })
      for (const turbine of turbines) {
        await helperDeleteTurbineRelatedData(turbine)
      }

      await Notification.deleteMany({
        $or: [{ idBuyer: id }, { idSeller: id }],
      })

      await Alert.deleteMany({ idUser: id })

      await User.findByIdAndDelete(id)
    }

    res.writeHead(204, { 'Content-Type': 'application/json' })
    res.end()
  } catch (error) {
    console.log(error)
  }
}

// @desc    Deletes a Alert
// @route   DELETE /api/users/alerts/:id
async function deleteAlert(req, res, id) {
  try {
    await Alert.findByIdAndDelete(id)
    res.writeHead(204, { 'Content-Type': 'application/json' })
    res.end()
  } catch (error) {
    console.log(error)
  }
}

// @desc    Deletes a Notification
// @route   DELETE /api/users/notifications/:id
async function deleteNotification(req, res, id) {
  try {
    await Notification.findByIdAndDelete(id)
    res.writeHead(204, { 'Content-Type': 'application/json' })
    res.end()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  getUserNotifications,
  getUserAlerts,
  getNotifications,
  getAlerts,
  getUserByMail,
  createUser,
  createNotification,
  createAlert,
  updateUser,
  userLogin,
  deleteUser,
  deleteAlert,
  deleteNotification,
  getUsersCSV,
}
