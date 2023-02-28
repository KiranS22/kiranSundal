<?php

if(isset($_REQUEST['iso'])){
  $countries = json_decode(file_get_contents("countryBorders.geo.json"), true);
  foreach ($countries['features'] as $country){
    if($country['properties']['iso_a2'] ==$_REQUEST['iso'] ){
      echo json_encode($country);

    }
  }

    
}else{
  $countries = json_decode(file_get_contents("countryBorders.geo.json"), true);
  $countryInfo = []; 
  foreach ($countries['features'] as $country){
   $properties  = array('name' => $country['properties']['name'], 'code' => $country['properties']['iso_a2']);
    array_push($countryInfo, $properties);
    
  }

  
  echo json_encode($countryInfo);
}
