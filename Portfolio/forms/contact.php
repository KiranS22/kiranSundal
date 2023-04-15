<?php
$name = $_POST['name'];
$email  = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

 //Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function




use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require '../vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.hostinger.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'support@kiransundal.co.uk';                     //SMTP username
    $mail->Password   = 'Kiran2579!';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('support@kiransundal.co.uk', $name);
    $mail->addAddress('krnsundal@gmail.com', 'Kiran Sundal');     //Add a recipient




    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $message;

// $url = 'https://kiransundal.co.uk/#contact';

    $mail->send();
    // header("Location: $url");

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";




		echo json_encode($output);
} catch (Exception $e) {


		$output['status']['code'] = "500";
		$output['status']['name'] = "error";
		$output['status']['description'] = "something went wrong";
        echo json_encode($output);
}
?>
