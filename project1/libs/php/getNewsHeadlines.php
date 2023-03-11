<?php 

$url ="https://newsapi.org/v2/top-headlines?country=". $_REQUEST['countryCode']."&apiKey=d14ee14877fc4359b367a0395e95845a" ;

$executionStartTime = microtime(true);


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  "Authorization: d14ee14877fc4359b367a0395e95845a",
  "Content-Type: application/json", 
  "User-Agent: MyAppName/1.0.0",

));

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['stat. "']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>