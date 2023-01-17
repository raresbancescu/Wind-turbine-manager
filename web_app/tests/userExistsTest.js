const assert = require("assert");
const { getUsers, getUserByEmail } = require("../models/RestAPIInteraction");
//check if a user exists in the database
//check the validity of all users get endpoint
async function test() {
  var user = await getUserByEmail("raresbancescu%40yahoo%2Ecom");

  var users = await getUsers();
  var selectedUser;
  for (currentUser of users) {
    if (currentUser.mail == "raresbancescu@yahoo.com")
      selectedUser = currentUser;
  }

   assert.deepEqual(user,selectedUser,'This user is not in the database')
}

test();
