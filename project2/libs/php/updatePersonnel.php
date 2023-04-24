<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/updatePersonnel.php?id=<id>&firstName=<firstName>&lastName=<lastName>&jobTitle=<jobTitle>&email=<email>&departmentID=<departmentID>

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
	$first_name = $_POST['firstName'];
	$last_name = $_POST['lastName'];
	$job_title = $_POST['jobTitle'];
	$email = $_POST['email'];
	$dept_id = $_POST['departmentID'];

	// check if any inputs are empty
	if (empty($id) || empty($first_name) || empty($last_name) || empty($job_title) || empty($email) || empty($dept_id)) {
		$output['status']['code'] = "500";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "referential integrity compromised: some inputs are empty";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	// check if the values have been entered into the database already
	$query_check = "SELECT * FROM personnel WHERE firstName = '$first_name' AND lastName = '$last_name' AND jobTitle = '$job_title' AND email = '$email' AND departmentID = '$dept_id' AND id != '$id'";
	$result_check = $conn->query($query_check);
	if ($result_check->num_rows > 0) {
		$output['status']['code'] = "1062";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "duplicate entries in the database";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}

	$query = $conn->prepare('UPDATE personnel SET firstName=?, lastName=?, jobTitle=?, email=?, departmentID=? WHERE id=?');

	$query->bind_param("ssssii", $first_name, $last_name, $job_title, $email, $dept_id, $id);

	$query->execute();

	if (false === $query_insert) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

		mysqli_close($conn);

		echo json_encode($output);

		?>
