const assert = require("assert");
const {
  getAllNotifications,
  getUsers,
} = require("../models/RestAPIInteraction");

//check if all the notifications belongs to a existing user

async function test() {
  var users = await getUsers();
  var notifications = await getAllNotifications();
  var validation = false;
  for (notification of notifications) {
    for (user of users) {
      if (
        notification.idBuyer == user._id ||
        notification.idSeller == user._id
      ) {
        validation = true;
      }
    }
  }
  assert(validation === true, "Notification does not belong to anyone");
}
test();
