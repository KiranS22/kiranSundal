<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/updateLocation.php?id=<id>&name=New%20Location

	// remove next two lines for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	// this includes the login details

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {

		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$id = $_POST['id'];
	$location_name = $_POST['name'];

	if(empty($id) || empty($location_name)) {
		$output['status']['code'] = "500";
		$output['status']['name'] = "error";
		$output['status']['description'] = "referential integrity compromised";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	$query = $conn->prepare('SELECT id FROM location WHERE name = ?');
	$query->bind_param("s", $location_name);
	$query->execute();
	$result = $query->get_result();

	if ($result->num_rows > 0) {
		$output['status']['code'] = "1062";
		$output['status']['name'] = "error";
		$output['status']['description'] = "duplicate entry";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	$query = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
	$query->bind_param("si", $location_name, $id);
	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

?>
