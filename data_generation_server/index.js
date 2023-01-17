const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));
const { default: axios } = require("axios");
const UPDATE_TIME_DELAY = 600000;
const {
  getNewTurbineWear,
  getNewPowerGenerated,
  getNewEfficiency,
} = require("./util");

/**
 * Gets all the turbines and updates the data for each one
 */
async function updateTurbines() {
  while (1) {
    const turbines = await getTurbines();

    for (turbine of turbines) {
      const state = turbine.turbineState;
      if (state === "Running") {
        await updateTurbine(turbine);
      } else {
        await updateStoppedTurbine(turbine);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, UPDATE_TIME_DELAY));
  }
}

/**
 * Gets all the turbines from the api
 * @returns the array of json objects, representing turbines
 */
async function getTurbines() {
  const turbines_api_url = "http://localhost:5000/api/turbines";

  const data = await fetch(turbines_api_url);
  const turbines = await data.json();

  return turbines;
}

/**
 * Update a stopped turbine
 * @param {JSON} turbine
 */
async function updateStoppedTurbine(turbine) {
  const id = turbine._id;
  const turbine_latest_data_api_url = `http://localhost:5000/api/turbines/data/${id}/new`;
  const data = await fetch(turbine_latest_data_api_url);
  const turbineData = await data.json();
  let newData;
  const date = Date.now();
  //   console.log("Old:");
  //   console.log(turbineData);
  if (turbineData.message === undefined) {
    // console.log("Old");
    const oldTurbineWear = turbineData.turbineWear;
    const oldPowerGenerated = turbineData.powerGenerated;
    newData = {
      windSpeed: 0,
      turbineWear: oldTurbineWear,
      powerGenerated: oldPowerGenerated,
      eficiency: 0,
      timeStamp: date.valueOf(),
    };
  } else {
    // console.log("New");
    const newWindSpeed = 0;
    const newTurbineWear = 0;
    const newPowerGenerated = 0;
    const newEffieciency = 0;

    newData = {
      windSpeed: newWindSpeed,
      turbineWear: newTurbineWear,
      powerGenerated: newPowerGenerated,
      eficiency: newEffieciency,
      timeStamp: date.valueOf(),
    };
  }
  await putNewData(id, newData);
}

/**
 * Stops a turbine with the wear >= 10
 * @param {mongoose.SchemaTypes.ObjectId} id
 */
async function stopTurbine(turbine) {
  const id = turbine._id;
  const put_turbine_api_url = `http://localhost:5000/api/turbines/${id}`;
  const newState = {
    turbineState: "Stopped",
  };

  await fetch(put_turbine_api_url, {
    method: "PUT",
    body: JSON.stringify(newState),
  });
}

/**
 * Updates the data for one single turbine
 * @param {JSON} turbine
 */
async function updateTurbine(turbine) {
  var newData;
  const id = turbine._id;

  const lat = turbine.latitude;
  const lng = turbine.longitude;
  const turbine_latest_data_api_url = `http://localhost:5000/api/turbines/data/${id}/new`;

  const data = await fetch(turbine_latest_data_api_url);
  const turbineData = await data.json();

  const weather_api_url = `http://api.weatherapi.com/v1/current.json?key=2407cb95cd0e4b31971101252221306&q=${lat},${lng}&aqi=no`;
  const response = await fetch(weather_api_url);
  const json = await response.json();

  const currentWindSpeed = (json.current.wind_kph * 5) / 18;
  const currentTemperature = json.current.temp_c;
  const currentHummidity = json.current.humidity;

  const date = Date.now();

  //   console.log("Turbine old: ");
  //   console.log(turbineData);

  if (turbineData.message === undefined) {
    // console.log("Old");
    const oldTurbineWear = turbineData.turbineWear;
    const oldPowerGenerated = turbineData.powerGenerated;
    const oldEfficiency = turbineData.eficiency;

    const newTurbineWear = getNewTurbineWear(
      oldTurbineWear,
      currentWindSpeed,
      currentTemperature,
      currentHummidity
    );
    const newPowerGenerated = getNewPowerGenerated(
      oldPowerGenerated,
      currentWindSpeed
    );
    const newEffieciency = getNewEfficiency(
      oldEfficiency,
      oldPowerGenerated,
      newPowerGenerated
    );

    if (newTurbineWear >= 10) {
      await stopTurbine(turbine);
    }

    if (
      currentWindSpeed > 20 ||
      currentTemperature > 32 ||
      currentTemperature < -32 ||
      currentHummidity > 60
    ) {
      await postNewAlert(turbine);
    }

    newData = {
      windSpeed: currentWindSpeed,
      turbineWear: newTurbineWear,
      powerGenerated: newPowerGenerated,
      eficiency: newEffieciency,
      timeStamp: date.valueOf(),
    };
  } else {
    // console.log("New");
    const newTurbineWear = 0;
    const newPowerGenerated = getNewPowerGenerated(0, currentWindSpeed);
    const newEffieciency = 0;

    newData = {
      windSpeed: currentWindSpeed,
      turbineWear: newTurbineWear,
      powerGenerated: newPowerGenerated,
      eficiency: newEffieciency,
      timeStamp: date.valueOf(),
    };
  }

  await putNewData(id, newData);
}

/**
 * Puts the newly generated data
 * @param {mongoose.SchemaTypes.ObjectId} id
 * @param {JSON} newData
 */
async function putNewData(id, newData) {
  //   console.log("Turbine new: ");
  //   console.log(newData);
  try {
    const response = await axios({
      method: "put",
      url: `http://localhost:5000/api/turbines/newdata/${id}`,
      data: JSON.stringify(newData),
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * Posts a new alert for the turbine
 * @param {JSON} turbine
 */
async function postNewAlert(turbine) {
  const post_alert_api_url = "http://localhost:5000/api/users/alerts";

  const newAlert = {
    idUser: turbine.userId,
    idTurbine: turbine._id,
  };

  console.log(newAlert);
  try {
    const response = await axios({
      method: "POST",
      url: post_alert_api_url,
      data: JSON.stringify(newAlert),
    });
  } catch (err) {
    console.log(err);
  }
}

updateTurbines();
