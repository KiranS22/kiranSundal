// Getting current location
function getGeoeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("position in geolocation", position);
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      console.log("Latitude:" + lat + "InLongitude: " + lon);
      let location = [];
      location.push(lat, lon);
      return location;
    });
  }
}
let view = getGeoeolocation();
let marker;
var map = L.map("map").setView(view, 6);

var MapTilesAPI_OSMEnglish = L.tileLayer(
  "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
  {
    attribution:
      '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: "c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
    maxZoom: 19,
  }
).addTo(map);

//easy buttons
// Triggers basic Contry Infomatiobn Modal
L.easyButton("fa-globe", function (btn, map) {
  if ($("#selectCountries").val() === "") {
    alert("Please Select a Country");
  } else {
    let basicCountryImfo = new bootstrap.Modal($("#countryInfo"), {});
    basicCountryImfo.show();
  }
}).addTo(map);

// Triggers basic Weather  Modal
L.easyButton("fa-cloud", function (btn, map) {
  if ($("#selectCountries").val() === "") {
    alert("Please Select a Country");
  } else {
    let weatherModal = new bootstrap.Modal($("#weatherInfo"), {});
    weatherModal.show();
  }
}).addTo(map);

// Triggers useful information  Modal
L.easyButton("fa-circle-info", function (btn, map) {
  if ($("#selectCountries").val() === "") {
    alert("Please Select a Country");
  } else {
    let usefulInfoModal = new bootstrap.Modal($("#usefulInfo"), {});
    usefulInfoModal.show();
  }
}).addTo(map);

marker = L.marker(view).addTo(map);
