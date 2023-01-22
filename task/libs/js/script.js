$(document).ready(function () {
  $("#country-btn").click(() => {
    let country = $("#selCountry").val();
    $.ajax({
      url: "libs/php/getCountryInfo.php",
      type: "POST",
      dataType: "json",
      data: {
        country: country,
      },
      success: function (result) {
        console.log("Result from Country inmfo ", result);

        if (result.status.name == "ok") {
          $("#result-1-text").html(result["data"][0]["continent"]);
          $("#result-2-text").html(result["data"][0]["capital"]);
          $("#result-3-text").html(result["data"][0]["languages"]);
          $("#result-4-text").html(result["data"][0]["population"]);
          $("#result-5-text").html(result["data"][0]["areaInSqKm"]);

          $("#result-1").html("Continent:");
          $("#result-2").html("Capital:");
          $("#result-3").html("languages:");
          $("#result-4").html("Population:");
          $("#result-5").html("area" + "(" + "km2" + ")");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  });
  $("#postcode-btn").click(() => {
    let postcode = $("#postcode").val();
    $.ajax({
      url: "libs/php/getPostcode.php",
      type: "POST",
      dataType: "json",
      data: {
        postcode: postcode,
      },
      success: function (result) {
        console.log(result);
        if (result.status.name == "ok") {
          $("#result-1-text").html(result["data"][0]["countryCode"]);
          $("#result-2-text").html(result["data"][0]["lat"]);
          $("#result-3-text").html(result["data"][0]["lng"]);
          $("#result-4-text").html(result["data"][0]["placeName"]);
          $("#result-5-text").html(result["data"][0]["postalCode"]);

          $("#result-1").html("Country Code:");
          $("#result-2").html("latitude:");
          $("#result-3").html("Logittude:");
          $("#result-4").html("Place Name:");
          $("#result-5").html("Postal Code:");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  });
  $("#timezone-btn").click(() => {
    let lat = $("#lat").val();
    let long = $("#long").val();
    console.log("lat", lat);
    console.log("long", long);
    $.ajax({
      url: "libs/php/getTimezoneInfo.php",
      type: "POST",
      dataType: "json",
      data: {
        lat: Number(lat),
        long: Number(long),
      },
      success: function (result) {
        console.log(result);

        if (result.status.name == "ok") {
          $("#result-1-text").html(result["data"]["countryCode"]);
          $("#result-2-text").html(result["data"]["countryName"]);
          $("#result-3-text").html(result["data"]["sunrise"]);
          $("#result-4-text").html(result["data"]["sunset"]);
          $("#result-5-text").html(result["data"]["time"]);

          $("#result-1").html("Country Code::");
          $("#result-2").html("Country Name:");
          $("#result-3").html("Sunrise:");
          $("#result-4").html("Sunset:");
          $("#result-5").html("time:");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  });
});
