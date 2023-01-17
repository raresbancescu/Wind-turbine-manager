const mongoose = require("mongoose");
const http = require("http");
const userController = require("./controllers/UserController");
const turbineController = require("./controllers/TurbineController");
const PORT = process.env.port || 5000;

// const User = require('./schemas/User')
// const Turbine = require('./schemas/Turbine')
// const AllTurbineData = require('./schemas/AllTurbineData')
// const Notification = require('./schemas/Notification')
// const Alert = require('./schemas/Alert')

mongoose.connect(
  "mongodb+srv://dandadan:proiect_web@cluster0.6dca8.mongodb.net/?retryWrites=true&w=majority"
);

const server = http.createServer((req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Max-Age", 2592000); // 30 days
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }
    switch (req.method) {
      case "GET":
        if (req.url === "/api/users") {
          userController.getUsers(req, res);
        }
        else if (req.url === '/api/users/csv') {
          userController.getUsersCSV(req, res)
        } else if (req.url.match(/\/api\/users\/[0-9a-f]{24}$/)) {
          const id = req.url.split('/')[3]
          userController.getUser(req, res, id)
        } else if (req.url.match(/\/api\/users\/mail\/[A-Za-z0-9_\%\.]+$/)) {
          const mail = req.url.split('/')[4]
          userController.getUserByMail(req, res, mail)
        } else if (
          req.url.match(/\/api\/users\/login\/[A-Za-z0-9_\%\.]+\/[a-z0-9]+$/)
        ) {
          const splitReq = req.url.split('/')
          const mail = splitReq[4]
          const password = splitReq[5]
          userController.userLogin(req, res, mail, password)
        } else if (req.url.match(/\/api\/users\/notifications$/)) {
          userController.getNotifications(req, res)
        } else if (req.url.match(/\/api\/users\/alerts$/)) {
          userController.getAlerts(req, res)
        } else if (
          req.url.match(/\/api\/users\/[0-9a-f]{24}\/notifications$/)
        ) {
          const id = req.url.split('/')[3]
          userController.getUserNotifications(req, res, id)
        } else if (req.url.match(/\/api\/users\/[0-9a-f]{24}\/alerts$/)) {
          const id = req.url.split('/')[3]
          userController.getUserAlerts(req, res, id)
        } else if (req.url === '/api/turbines') {
          turbineController.getTurbines(req, res)
        } else if (req.url === '/api/turbines/public') {
          turbineController.getPublicTurbines(req, res)
        } else if (req.url.match(/\/api\/turbines\/[0-9a-f]{24}$/)) {
          const id = req.url.split('/')[3]
          turbineController.getTurbine(req, res, id)
        } else if (req.url.match(/\/api\/turbines\/data\/[0-9a-f]{24}$/)) {
          const turbineid = req.url.split('/')[4]
          turbineController.getTurbineData(req, res, turbineid)
        } else if (req.url.match(/\/api\/turbines\/data\/[0-9a-f]{24}\/new$/)) {
          const turbineid = req.url.split('/')[4]
          turbineController.getNewestTurbineData(req, res, turbineid)
        } else if (req.url.match(/\/api\/turbines\/private\/[0-9a-f]{24}$/)) {
          const userId = req.url.split('/')[4]
          turbineController.getPrivateTurbines(req, res, userId)
        } else if (req.url.match(/\/api\/turbines\/private\/[0-9a-f]{24}\/csv$/)) {
          const userId = req.url.split('/')[4]
          turbineController.getPrivateTurbinesCSV(req, res, userId)
        } else if (req.url.match(/\/api\/turbines\/public\/\w+$/)) {
          const name = req.url.split('/')[4]
          turbineController.getPublicTurbineByName(req, res, name)
        } else if (
          req.url.match(/\/api\/turbines\/private\/[0-9a-f]{24}\/\w+$/)
        ) {
          const urlSplit = req.url.split('/')
          const userId = urlSplit[4]
          const name = urlSplit[5]
          turbineController.getPrivateTurbineByName(req, res, userId, name)
        } else if (
          req.url.match(
            /\/api\/turbines\/filter\/[0-9a-f]{24}\??(?:&?[^=&]*=[^=&]*)*$/
          )
        ) {
          const turbineId = req.url.split('/')[4].substring(0, 24)
          turbineController.filterTurbines(req, res, turbineId)
        } else if (
          req.url.match(/\/api\/turbines\/filter\??(?:&?[^=&]*=[^=&]*)*$/)
        ) {
          turbineController.filterTurbines(req, res, null)
        } else {
          throw new Error('GET route not found')
        }

        break;
      case "POST":
        if (req.url === "/api/turbines") {
          turbineController.createTurbine(req, res);
        } else if (req.url === '/api/users') {
          userController.createUser(req, res)
        } else if (req.url === '/api/turbines/import') {
          console.log("in import")
          turbineController.importTurbines(req, res)
        } else if (req.url === '/api/users/notifications') {
          userController.createNotification(req, res)
        } else if (req.url === '/api/users/alerts') {
          userController.createAlert(req, res)
        } else {
          throw new Error('POST route not found')
        }
        break;
      case "PUT":
        if (req.url.match(/\/api\/turbines\/newdata\/[0-9a-f]{24}$/)) {
          const turbineId = req.url.split("/")[4];
          turbineController.postNewData(req, res, turbineId);
        } else if (req.url.match(/\/api\/turbines\/[0-9a-f]{24}$/)) {
          const turbineId = req.url.split("/")[3];
          turbineController.updateTurbine(req, res, turbineId);
        } else if (req.url.match(/\/api\/users\/[0-9a-f]{24}$/)) {
          const userId = req.url.split("/")[3];
          userController.updateUser(req, res, userId);
        } else {
          throw new Error("PUT route not found");
        }
        break;
      case "DELETE":
        if (req.url.match(/\/api\/users\/[0-9a-f]{24}$/)) {
          const id = req.url.split("/")[3];
          userController.deleteUser(req, res, id);
        } else if (req.url.match(/\/api\/users\/alerts\/[0-9a-f]{24}$/)) {
          const id = req.url.split("/")[4];
          userController.deleteAlert(req, res, id);
        } else if (
          req.url.match(/\/api\/users\/notifications\/[0-9a-f]{24}$/)
        ) {
          const id = req.url.split("/")[4];
          userController.deleteNotification(req, res, id);
        } else if (req.url.match(/\/api\/turbines\/[0-9a-f]{24}$/)) {
          const id = req.url.split("/")[3];
          turbineController.deleteTurbine(req, res, id);
        } else {
          throw new Error("DELETE route not found");
        }
        break;
      default:
        throw new Error("Unacceptable http verb");
    }
  } catch (error) {
    console.log(error);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: error.message }));
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
