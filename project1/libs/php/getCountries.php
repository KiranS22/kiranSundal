<?php

if(isset($_REQUEST['iso'])){
  $countries = json_decode(file_get_contents("countryBorders.geo.json"), true);
  foreach ($countries['features'] as $country){
    if($country['properties']['iso_a2'] ==$_REQUEST['iso'] ){
      echo json_encode($country);

    }
  }

    
}else{
  $countries = file_get_contents("countryBorders.geo.json");
echo $countries;
}