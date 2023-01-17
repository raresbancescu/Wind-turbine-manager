const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const PageController = require("./controllers/PageController");
const { parseCookies } = require("./utils");
const PORT = process.env.port || 5001;

const server = http.createServer((req, res) => {
  try {
    if (req.url === "/pages") {
      PageController.getLandingPage(req, res);
    } else if (req.url.match(/\/pages\/public\??(?:&?[^=&]*=[^=&]*)*$/)) {
      const cookies = parseCookies(req);
      const id = cookies.user_id;
      PageController.getPublicPage(req, res, id);
    } else if (req.url.match(/\/pages\/owned\??(?:&?[^=&]*=[^=&]*)*$/)) {
      const cookies = parseCookies(req);
      const id = cookies.user_id;
      PageController.getPrivatePage(req, res, id);
    } else if (req.url === "/pages/createTurbine") {
      PageController.getCreateTurbinePage(req, res);
    } else if (req.url === "/pages/apiDocumentation") {
      PageController.getApiDocumentationPage(req, res);
    } else if (req.url === "/pages/login") {
      PageController.getLoginPage(req, res);
    } else if (req.url === "/pages/userDetails") {
      PageController.getUserDetailsPage(req, res);
    } else if (req.url === "/pages/register") {
      PageController.getRegisterPage(req, res);
    } else if (req.url === "/pages/resetpass") {
      PageController.getResetPassPage(req, res);
    } else if (req.url === "/pages/notifications") {
      const cookies = parseCookies(req);
      const id = cookies.user_id;
      PageController.getNotificationsPage(req, res, id);
    } else if (req.url.match(/\/pages\/turbineDetails\/\w+$/)) {
      const id = req.url.split("/")[3];
      const cookies = parseCookies(req);
      const userId = cookies.user_id;
      PageController.getTurbineDetailsPage(req, res, id, userId);
    } else if (req.url === "/unauthorized") {
      PageController.getUnauthorizedPage(req, res);
    } else if (req.url === "/pages/doc") {
      PageController.getDocumentationPage(req, res);
    } else if (req.url === '/pages/admin') {
      PageController.getAdminPage(req, res)
    } else if (req.url === '/import/turbines' && req.method === 'POST') {
      const cookies = parseCookies(req)
      const id = cookies.user_id
      PageController.uploadCSV(req, res, id)
    } else {
      fs.readFile(__dirname + req.url, function (err, data) {
        if (err) {
          res.writeHead(404)
          res.end(JSON.stringify(err))
          return
        }
        res.writeHead(200)
        res.end(data)
      })
    }
  } catch (error) {
    console.log(error);
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 NOT FOUND</h1>");
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
