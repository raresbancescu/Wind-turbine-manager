const assert = require("assert");
const { getAllCompanies, getUsers } = require("../models/RestAPIInteraction");

//check if all companies in our database match the users companies
async function test() {
  var users = await getUsers();
  var companies = await getAllCompanies();
  var result = users.map((x) => x.company);
  console.log(result);
  console.log(companies);
  assert.deepEqual(companies, result, "They are not equals");
}
test();
