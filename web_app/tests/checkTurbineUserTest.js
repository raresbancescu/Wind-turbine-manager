const assert = require("assert");
const {
  getAllTurbines,
  getUsers,
} = require("../models/RestAPIInteraction");
//check if all turbines are asigned to a user
async function test()
{
    var users=await getUsers()
    var turbines=await getAllTurbines()
    var validation=false
    for (turbine of turbines)
    {
        for (user of users)
        {
            if (turbine.userId==user._id)
            {
                validation=true
            }
        }
    }

    assert(validation===true,"Turbine does not belong to any user")
}
test()