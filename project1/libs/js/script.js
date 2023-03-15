let allRestCountries = [];
let polygons = [];
let countryCodeFromOpenCage = null;
let year = new Date().getFullYear();
let currentYear = year.toString();
// tile layer
let streets = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
  }
);

let satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

let basemaps = {
  Streets: streets,
  Satellite: satellite,
};

let map = L.map("map");
map.setView([51.509865, -0.118092], 4);

// tile layer
L.tileLayer(
  "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
  {
    attribution:
      '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: "c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f",
    maxZoom: 19,
    minZoom: 4,
  }
).addTo(map);
let marker = null;
// clusterMarkers
let cityMarkers = L.markerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
});
// placesmarker
let placesMarkers = L.markerClusterGroup({
  polygonOptions: {
    fillColor: "#fff",
    color: "#000",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
});
$(document).ready(() => {
  // variable definitions

  //easy buttons
  // Triggers basic Contry Infomatiobn Modal
  L.easyButton("fa-globe", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let basicCountryImfo = new bootstrap.Modal($("#countryInfo"), {});
      basicCountryImfo.show();
    }
  }).addTo(map);

  // Triggers basic Weather  Modal
  L.easyButton("fa-cloud", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let weatherModal = new bootstrap.Modal($("#weatherInfo"), {});
      weatherModal.show();
    }
  }).addTo(map);

  // Triggers useful information  Modal
  L.easyButton("fa-info", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let usefulInfoModal = new bootstrap.Modal($("#usefulInfo"), {});
      usefulInfoModal.show();
    }
  }).addTo(map);

  // Triggers puplic holidays modal
  L.easyButton("fa-umbrella-beach", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let holidaysModal = new bootstrap.Modal($("#public-holiday"), {});
      holidaysModal.show();
    }
  }).addTo(map);

  // Triggers news headlines modal
  L.easyButton("fa-newspaper", (btn, map) => {
    if ($("#selectCountries").val() === "") {
      alert("Please Select a Country");
    } else {
      let newsModal = new bootstrap.Modal($("#news-headlines"), {});
      newsModal.show();
    }
  }).addTo(map);
  // ------------------------------------------
  // Ajax request functinas
  const getCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: "",
      dataType: "json",
      success: (response) => {
        let countryInfo = response;
        countryInfo = Object.values(countryInfo).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        let str = "";
        for (let i = 0; i < countryInfo.length; i++) {
          const country = countryInfo[i];
          str += `<option value="${country.code}">${country.name}</option>`;
        }

        $("#selectCountries").append(str);
        getGeoeolocation();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getGeoeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;

          let location = [];
          location.push(lat, lon);

          marker = L.marker(location).addTo(map);

          // call  getting country by coordinate
          getCountryByCoord(lat, lon);

          return location;
        },
        () => {
          $("#selectCountries").val("GB").change();
        }
      );
    } else {
      $("#selectCountries").val("GB").change();
    }
  };

  const getCountryByCoord = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: (response) => {
        countryCodeFromOpenCage =
          response.data.results[0].components["ISO_3166-1_alpha-2"];
        // Calling change event once data comes back from openCage (reverse geocode)
        $("#selectCountries").val(countryCodeFromOpenCage).change();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getRestCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getRestCountries.php",
      dataType: "json",
      success: (response) => {
        allRestCountries = response.data;
        populateModals();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const removeBorders = () => {
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) map.removeLayer(layer);
    });
  };

  const getSingleCountryBorders = (isoCode) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: { iso: isoCode },
      dataType: "json",
      success: (response) => {
        drawBorders(response);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const drawBorders = (country) => {
    let border = L.geoJSON(country).addTo(map);
    map.fitBounds(border.getBounds());
    let myStyle = {
      color: "#ff7800",
      weight: 5,
      opacity: 0.65,
    };

    let polygon = L.geoJSON(country, {
      style: myStyle,
    }).addTo(map);
    polygons.push(polygon);
  };

  const getCountryFromOpenCageByName = (countryName, latlng) => {
    /*The second parameter latng is used because the bellow ajax request returns null for some values. If this is the case the second parameter will be used  */

    $.ajax({
      type: "GET",
      url: "libs/php/getCountryByCoord.php",
      data: { country: countryName },
      dataType: "json",
      success: (response) => {
        let lat;
        let long;

        if (response.data !== null) {
          lat = response.data.results[0].geometry.lat;
          long = response.data.results[0].geometry.lng;
        } else {
          lat = latlng[0];
          long = latlng[1];
        }

        if (marker !== null) {
          map.removeLayer(marker);
        }
        marker = L.ExtraMarkers.icon({
          icon: "fa-map-marker-alt",
          markerColor: "red",
          markerColor: "red",
          prefix: "fa-solid",
        });

        L.marker([lat, long], { icon: marker }).addTo(map);

        map.panTo([lat, long], { animate: true, duration: 1 });
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getWeatherInfo = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getWeather.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: (response) => {
        let t = (parseFloat(response.data.main.temp) - 273.15).toFixed(2);

        let t_diff = parseInt(response.data.timezone) / 3600;

        let t_utc = t_diff > 0 ? `UTC +${t_diff}` : `UTC ${t_diff}`;
        // Populating weather Modal

        let content = `<table class="table table-striped w-100 ">
          <thead >
          <tr class="bg-info text-dark">
            <th class="thead-styling">Current Weather</th>
            <th class="thead-styling">Temperature</th>
            <th class="thead-styling">Timezone(UTC)</th>
            <th class="thead-styling"> latitude</th>
            <th class="thead-styling">longitude</th>

          </tr>
         </thead>`;

        content += `<tbody>
             <tr>
               <td>${response.data.weather[0].description}</td>
               <td>${t}</td>
               <td>${t_utc}</td>
               <td>${lat}</td>
               <td>${long}</td>`;
        content += "</tr></tbody></table>";

        $("#w-info-1").append(content);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getExchangeRate = (currency) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getExchangeRate.php",
      data: { currency: currency },
      dataType: "json",
      success: (response) => {
        const usd = response.data.rates.USD;
        const gbp = response.data.rates.GBP;
        const eur = response.data.rates.EUR;
        let content = `<h3 class="caption">Exchange Rates<h3><table class="table table-striped w-100 ">`;

        content += `<thead>
          <tr class="bg-info text-dark">
            <th class="thead-styling">USD</th>
            <th class="thead-styling">GBP</th>
            <th class="thead-styling">EUR</th>
          </tr>
         </thead>`;

        content += `<tbody>
             <tr>
            
               <td>${usd}</td>
               <td>${gbp}</td>
               <td>${eur}</td>
               `;
        content += "</tr></tbody></table>";

        $("#u-info-1").html(content);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getWikiLinks = (lat, long) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getWikiLinks.php",
      data: { lat: lat, long: long },
      dataType: "json",
      success: (response) => {
        if (response.data.geonames.length > 0) {
          let content = ` <h3 class="caption">Wikipedia Links </h3> <table class="table table-striped w-100">`;
          content += `<thead>
          <tr class="bg-info text-dark">
            <th class="thead-styling">Links</th> </thead`;

          content += `<tbody>`;

          let wikiInfo = response.data.geonames;
          let linksToDisplay = wikiInfo.map((url) => {
            let fullUrl = "https://" + url.wikipediaUrl;
            return fullUrl;
          });
          let wikiTitles = wikiInfo.map((article) => {
            let title = article.title;


            return title;
          });

          linksToDisplay.forEach((link, index) => {
            content += `<tr class="text-dark wikiLinks"> <td "><a href="${link}">${wikiTitles[index]}</a></tr>`;
            return content;
          });

          content += "</tbody></table>";
          $("#u-info-2").append(content);
        } else {
          $("#u-info-2").html(`<p>No articles found</p>`);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getPublicHolidayInfo = (countryCode, currentYear) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getPublicHolidayInfo.php",
      data: { countryCode: countryCode, year: currentYear },
      dataType: "json",
      success: (response) => {
        let holidayInformation = response;

        const duplicatehols = holidayInformation.map((o) => o.name);
        const filteredHolidays = holidayInformation.filter(
          ({ name }, index) => !duplicatehols.includes(name, index + 1)
        );

        let content = `<table class="table table-striped w-100 ">`;
        content += `<thead>
        <tr  class="bg-info text-dark">
          <th class="thead-styling">Name</th>
          <th class="thead-styling">Date</th>
          <th class="thead-styling">Date</th>
        </tr>
       </thead>`;

        for (i = 0; i < filteredHolidays.length; i++) {
          const holiday = filteredHolidays[i];
          console.log(Date.parse(holiday.date).toString("ddd dS MMM"));

          content += `<tbody>
           <tr>
             <td>${holiday.name}</td>
             
             <td>${Date.parse(holiday.date).toString("ddd dS MMM")}</td>

             
             <td>${Date.parse(holiday.date).toString("ddd dS MMM")}</td>

           </tr>`;
        }
        content += "</table>";

        $("#ph-info-1").append(content);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };

  const getNewsHeadlines = (countryCode) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getNewsHeadlines.php",
      data: { countryCode: countryCode.toLowerCase() },
      dataType: "json",
      success: (response) => {
        let newsHeadlines = response.data.articles;
        let content = `<table class="table table-striped w-100 ">`;
        content += `<thead>
        <tr  class="bg-info text-dark">
          <th class="thead-styling">Title</th>
          <th class="thead-styling">Author</th>
        </tr>
       </thead>`;
        for (i = 0; i < newsHeadlines.length; i++) {
          const headline = newsHeadlines[i];

          content += `<tbody>
           <tr>
             <td><a class="news-link" href="${headline.url}">${headline.title}</a></td>
             <td>${headline.author}</td>
          
           </tr>`;
        }
        content += "</table>";

        $("#nh-info-1").append(content);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getCitiesByCountryCode = (countryCode) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCities.php",
      data: { countryCode: countryCode },
      dataType: "json",
      success: (response) => {
        let cityInfo = response.data;

        for (let i = 0; i < cityInfo.length; i++) {
          let icon = L.ExtraMarkers.icon({
            icon: "fa-city",
            prefix: "fa-solid",
          });
          const city = cityInfo[i];
          let cityLat = city.lat;
          let cityLng = city.lng;
          let marker = L.marker([cityLat, cityLng], { icon: icon });

          cityMarkers.addLayer(marker);
          cityMarkers.addLayer(marker);
        }
        map.addLayer(cityMarkers);
        map.addLayer(cityMarkers);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getNearbyParksAndHospitals = (lat, lng) => {
    $.ajax({
      type: "GET",
      url: "libs/php/getNearbyParksAndHospitals.php",
      data: { lat: lat, lng: lng },
      dataType: "json",
      success: (response) => {
        let places = response.data;

        let icon = null;
        for (let i = 0; i < places.length; i++) {
          const place = places[i];
          if (place.types.includes("parks")) {
            icon = L.ExtraMarkers.icon({
              icon: "fa-tree",
              markerColor: "green",
              markerColor: "green",
              prefix: "fa-solid",
            });
          } else if (place.types.includes("hospital")) {
            icon = L.ExtraMarkers.icon({
              icon: "fa-hospital",
              markerColor: "red",
              markerColor: "red",
              prefix: "fa-solid",
            });
          }

          let placelat = place.location.lat;
          let placelng = place.location.lng;
          if (icon != null) {
            let marker = L.marker([placelat, placelng], { icon: icon });
            marker.bindPopup(
              `<h4 class="popup-name">Name: ${place.name}</h4> <p class="popup-address"> Address:${place.address}</p>`
            );
            const onClick = (e) => {
              let popup = e.target.getPopup();
              let content = popup.getContent();
            };
            marker.on("click", onClick);

            placesMarkers.addLayer(marker);
            placesMarkers.addLayer(marker);
          }
        }
        map.addLayer(placesMarkers);
        map.addLayer(placesMarkers);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  // ------------------------------------------

  // Function that populates all modals
  const populateModals = () => {
    let singleRestCountry = allRestCountries.find(
      (restCountry) => countryCodeFromOpenCage === restCountry.cca2
    );

    if (singleRestCountry) {
      let content = `<table class="table table-striped w-100 "> 
      <thead>
      <tr class="bg-info text-dark">
        <th class="thead-styling">Name</th>
        <th class="thead-styling">Capital</th>
        <th class="thead-styling">Population</th>
        <th class="thead-styling"> Flag</th></th>
        <th class="thead-styling">Borders With</th>
        <th class="thead-styling">Sub-region</th>
      </tr>
     </thead>`;

      content += `<tbody>
         <tr>
           <td>${singleRestCountry.name.common}</td>
           <td>${singleRestCountry.capital[0]}</td>
           <td>${singleRestCountry.population}</td>
           <td><img class="flag" src="${singleRestCountry.flags.png}"/></td>
         `;

      if (singleRestCountry.borders) {
        let str = "";

        singleRestCountry.borders.forEach((border) => {
          content += `<td class="borders-list">${(str += `<li>${border}</li>`)}</td>`;
        });
      } else {
        content += `<td class="borders-list">${(str += `<p>${"Borders Not Found"}</p>`)}</td>`;
      }
      if (singleRestCountry.subregion) {
        content += `<td class="subregion">${singleRestCountry.subregion}</td>`;
      } else {
        content += `<td class="subregion"><p>Sub-region not found</p></td>`;
      }
      content += `</tr> </tbody> </table> `;

      $("#info-1").html(content);

      let lat = singleRestCountry.latlng[0];
      let long = singleRestCountry.latlng[1];
      getWeatherInfo(lat, long);
      getNearbyParksAndHospitals(lat, long);

      let countryCurrency = Object.keys(singleRestCountry.currencies)[0];
      // calling getExchangeRate for useful info modal
      getExchangeRate(countryCurrency);
      getWikiLinks(lat, long);
      getPublicHolidayInfo(singleRestCountry.cca2, currentYear);
      getNewsHeadlines(singleRestCountry.cca2);
      // calling getCitiesByCountryCode
      getCitiesByCountryCode(singleRestCountry.cca2);
    }
  };

  //Calling getCountries to populate select
  getCountries();

  //Calling getRestCountries to get more info
  getRestCountries();

  // .change callback function
  $("#selectCountries").change(() => {
    let selectval = $("#selectCountries").val();
    let countryCapital = null;
    let latlng = null;
    countryCodeFromOpenCage = selectval;
    if (allRestCountries.length > 0) {
      let singleRestCountry = allRestCountries.find(
        (restCountry) => countryCodeFromOpenCage === restCountry.cca2
      );
      latlng = singleRestCountry.latlng;

      if (singleRestCountry.capital) {
        countryCapital = singleRestCountry.capital[0];
      } else {
        console.log("Capital not found");
      }
      populateModals();
    }

    if (polygons !== undefined) {
      removeBorders();
    }

    getSingleCountryBorders(selectval);
    // brings back coords based on iso code
    let data = countryCapital ? countryCapital : selectval;

    getCountryFromOpenCageByName(data, latlng);
  });
});
console.log("All good uptil here");
