const assert = require("assert");
const {
  getAllAlerts,
  getUsers,
} = require("../models/RestAPIInteraction");

//check if all the notifications belongs to a existing user

async function test() {
  var users = await getUsers();
  var alerts = await getAllAlerts();
  var validation = false;
  for (currentAlert of alerts) {
    for (user of users) {
      if (
        currentAlert.idUser == user._id 
        
      ) {
        validation = true;
      }
    }
  }
  assert(validation === true, "Alert does not belong to anyone");
}
test();
