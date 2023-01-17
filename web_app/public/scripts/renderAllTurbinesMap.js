/*
api.weatherapi.com/v1 -- weather api
api.open-elevation.com -- altitude api

api.weatherbit.io/v2.0/current -- air quality
*/

let turbines;

function initTurbines(data) {
  turbines = data;
}

function initMap() {
  const mapDiv = document.getElementById("map");
  const map = new google.maps.Map(mapDiv, {
    zoom: 8,
    center: { lat: 47.397, lng: 27.644 },
  });

  for (turbine of turbines) {
    marker = new google.maps.Marker({
      map,
      animation: google.maps.Animation.DROP,
      position: { lat: turbine.latitude, lng: turbine.longitude },
      label: turbine.name,
    });
  }
}

function expand(img) {
  const content = document.getElementById("map-content");
  content.classList.toggle("expand");
  img.classList.toggle("rotate");
}

window.initMap = initMap;
