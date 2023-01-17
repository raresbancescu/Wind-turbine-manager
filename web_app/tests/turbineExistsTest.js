const assert = require("assert");
const { getTurbine, getTurbines } = require("../models/RestAPIInteraction");

//check if a turbine exists in the database
//check the validity of all turbines get endpoint
async function test() {
  var turbine = await getTurbine("62b0847ede70d8644cd36282");
  var turbines = await getTurbines();
  var selectedTurbine;
  for (tur of turbines) {
    if (tur._id == "62b0847ede70d8644cd3628") selectedTurbine = tur;
  }
  assert.deepEqual(turbine, selectedTurbine, "They are not equals");
}
test();
