const UPDATE_TIME_DELAY = 600000;
const AIR_DENSITIY = 1.225;
const SECTIONAL_AREA = 400;


function getNewTurbineWear(oldTurbineWear, windSpeed, temperature, humidity) {
    let newTurbineWear = oldTurbineWear;

    if(windSpeed > 20) {
        newTurbineWear += 0.02;
    }

    if(temperature > 32 || temperature < -32) {
        newTurbineWear += 0.01;
    }

    if(humidity > 60) {
        newTurbineWear += 0.01;
    }
    return newTurbineWear;
}

// Power (W) = 1/2 x ρ x A x v3

// Power = Watts
// ρ (rho, a Greek letter) = density of the air in kg/m3
// A = cross-sectional area of the wind in m2
// v = velocity of the wind in m/s
function getNewPowerGenerated(oldPowerGenerated, windSpeed) {
    return oldPowerGenerated + windSpeed * AIR_DENSITIY * SECTIONAL_AREA * (UPDATE_TIME_DELAY / 3600000) * 0.5;
}

function getNewEfficiency(oldEfficiency, oldPowerGenerated, newPowerGenerated) {
    return (newPowerGenerated - oldPowerGenerated > 200) ? (oldEfficiency <= 0.9 ? oldEfficiency + 0.1 : 1) : (oldEfficiency >= 0.001 ? oldEfficiency - 0.001 : 0);
}

module.exports = { getNewTurbineWear, getNewPowerGenerated, getNewEfficiency };