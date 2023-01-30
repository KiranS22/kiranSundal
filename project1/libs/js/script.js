$(document).ready(function () {
  // Openingf modal
  $("#appInstructions").modal("show");
  let allCountries = [];
  let allRestCountries = [];
  const getCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getCountries.php",
      data: "",
      dataType: "json",
      success: function (response) {
        // console.log("Countries from json", response.features);

        let countryInmfo = response.features;
        allCountries = countryInmfo;
        let str = "";
        countryInmfo.forEach((country) => {
          // console.log('',country);
          str += `<option value="${country.properties.name}">${country.properties.name}</option>`;
        });
        $("#selectCountries").append(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  const getRestCountries = () => {
    $.ajax({
      type: "GET",
      url: "libs/php/getRestCountries.php",
      dataType: "json",
      success: function (response) {
        console.log(response);
        allRestCountries = response;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
  //Calling getCountries
  getCountries();
  //Calling getRestCountries to get more info
  getRestCountries();

  $("#selectCountries").change(() => {
    let selectval = $("#selectCountries").val();
    let obj;
    //find t he name in geoCountries that matches select dropdown
    const singleCountry = allCountries.find((c) => {
      return c.properties.name == selectval;
    });
    console.log(singleCountry);
    const singleRestCountry = allRestCountries.find(
      (allCountries) => singleCountry.cca3 === allCountries.iso_a3
    );
    console.log("SingleCountry from restCountry", singleRestCountry);
  });
});
