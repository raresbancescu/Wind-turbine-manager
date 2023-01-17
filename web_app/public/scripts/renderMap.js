/*
api.weatherapi.com/v1 -- weather api
api.open-elevation.com -- altitude api

api.weatherbit.io/v2.0/current -- air quality
*/
function initMap() {
  const mapDiv = document.getElementById("map");
  const map = new google.maps.Map(mapDiv, {
    zoom: 8,
    center: { lat: 47.397, lng: 27.644 },
  });

  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
    position: { lat: 47.397, lng: 27.644 },
  });

  infoWindow.open(map);

  map.addListener(
    "click",
    async (mapsMouseEvent) => {
      const coords = mapsMouseEvent.latLng.toJSON();
      infoWindow.close();

      const lat = coords.lat;
      const lng = coords.lng;

      const weather_api_url = `http://api.weatherapi.com/v1/current.json?key=2407cb95cd0e4b31971101252221306&q=${lat},${lng}&aqi=no`;
      const response = await fetch(weather_api_url);
      const json = await response.json();

      const locat =
        json.location.country +
        ", " +
        json.location.region +
        ", " +
        json.location.name;
      const wind = (json.current.wind_kph * 5) / 18;
      const temp = json.current.temp_c;
      const hum = json.current.humidity;

      const air_quality_api_url = `http://api.weatherbit.io/v2.0/current?key=7f4af6599f8142b49c61706ba3dc2a83&lat=${lat}&lon=${lng}`;
      const res = await fetch(air_quality_api_url);
      const jsn = await res.json();

      const weatherDescription = jsn.data[0].weather.description;
      const airQuality = jsn.data[0].aqi;

      const alt = await getAltitude(lat, lng);
      const sol = await getSoilData();
      const suit = await getSuitability(airQuality, wind, temp);

      infoWindow = new google.maps.InfoWindow({
        position: { lat, lng },
      });

      infoWindow.setContent(locat + " " + lat + " " + lng);
      infoWindow.open(map);

      await updateAtributes(
        locat,
        lat,
        lng,
        weatherDescription,
        wind,
        temp,
        hum,
        alt,
        sol,
        suit
      );
    },
    { passive: true }
  );
}

async function getSoilData() {
  const soilType = ["Sandy", "Chalk", "Clay", "Loamy", "Peaty", "Silty"];

  const index = Math.floor(Math.random() * soilType.length);
  return soilType[index];
}

async function getSuitability(airQuality, wind, temp) {
  var suitability = 100;
  suitability -= (airQuality % 10) / 2;

  if (wind > 20 || temp > 30) {
    suitability -= 5;
  }

  return suitability;
}

async function getAltitude(lat, lng) {
  const elevation_api_url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
  const response = await fetch(elevation_api_url);
  const json = await response.json();

  return json.results[0].elevation;
}

async function updateAtributes(
  locat,
  lat,
  lng,
  weatherDescription,
  wind,
  temp,
  hum,
  alt,
  sol,
  suit
) {
  var lc = document.getElementById("location");
  var lt = document.getElementById("lat");
  var ln = document.getElementById("lng");
  var wnd = document.getElementById("wind");
  var tmp = document.getElementById("temperature");
  var hm = document.getElementById("humidity");
  var al = document.getElementById("altitude");
  var sl = document.getElementById("soil-type");
  var stb = document.getElementById("suitability");
  var wd = document.getElementById("wd");

  lt.innerHTML = lat;
  ln.innerHTML = lng;
  lc.innerHTML = locat;
  wnd.innerHTML = wind;
  tmp.innerHTML = temp;
  hm.innerHTML = hum;
  al.innerHTML = alt;
  sl.innerHTML = sol;
  stb.innerHTML = suit;
  wd.innerHTML = weatherDescription;
}

window.initMap = initMap;
