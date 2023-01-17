const assert = require("assert");
const { getOwnedTurbines, getPublicTurbines } = require("../models/RestAPIInteraction");

//check a owned turbine that is not public is not in the public turbine list
async function test()
{
  
    var validation=true
    var getOwnedTurbinesForUser=await getOwnedTurbines("62b0847ede70d8644cd36282");
    var publicTurbines=await getPublicTurbines()
    for (owned of getOwnedTurbinesForUser)
    {
        if (owned.isPublic=false)
        {
            for (public of publicTurbines)
            {
                if (owned==public) validation=false
            }
        }
    }
    assert(validation===true,"Turbine is in the public list")
}

test()