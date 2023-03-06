<?php $url =  "https://corona-virus-world-and-india-data.p.rapidapi.com/api?rapidapi-key=c4edb04533mshba882524ef1f0e1p1f0643jsna3c2c78e057f?" ;
$executionStartTime = microtime(true);


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);
echo $result;

// $decode = json_decode($result,true);	

// $output['status']['code'] = "200";
// $output['status']['name'] = "ok";
// $output['status']['description'] = "success";
// $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
// $output['data'] = $decode;

// header('Content-Type: application/json; charset=UTF-8');

// echo json_encode($output);
