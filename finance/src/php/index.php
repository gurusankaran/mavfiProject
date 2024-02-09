<?php

require_once('connection.php');

if ($_POST['reason'] == 'signup') {
    $email = $_POST['regiEmail'];

    $emailStatus = adminValidate($email, $con);

    if ($emailStatus == "false") {
        $name = isset($_POST['regiName']) ? trim($_POST['regiName']) : '';
        $password = isset($_POST['regiPassword']) ? trim($_POST['regiPassword']) : '';
        $mobile = isset($_POST['regiMobile']) ? trim($_POST['regiMobile']) : '';

        // Input Validation
        if (empty($name) || empty($email) || empty($mobile) || empty($password)) {
            exit(json_encode('All fields must be filled'));
        }

        // Email Validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            exit(json_encode('Invalid email format'));
        }

        // Mobile Number Validation
        if (!ctype_digit($mobile) || strlen($mobile) !== 10) {
            exit(json_encode('Invalid mobile number'));
        }

        $password = password_hash($password, PASSWORD_DEFAULT);

        $imageStoreName = explode('@', $email);
        $imageStoreName = $imageStoreName[0] . "_Image";

        $image = $_FILES['sample_image'];
        $imageTempName = $image['tmp_name'];

        // Validate file type
        $allowedExtensions = ['jpg', 'jpeg', 'png'];
        $fileExtension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));

        $imageStoreName = $imageStoreName . "." . $fileExtension;

        $targetPath = "../../userPic/" . $imageStoreName;

        if (!in_array($fileExtension, $allowedExtensions)) {
            exit(json_encode('Invalid file type. Allowed types: jpg, jpeg, png'));
        }

        if (move_uploaded_file($imageTempName, $targetPath)) {
            $registerStatus = registerFunction($name, $email, $password, $mobile, $imageStoreName, $con);
            exit(json_encode('Registered Successfully'));
        } else {
            exit(json_encode('Failed to Registered.'));
        }
    } elseif ($emailStatus == "true") {
        exit(json_encode('Already Registered'));
    }
} else if ($_POST['reason'] == 'login') {
    $loginEmail = $_POST['email'];
    $loginPassword = $_POST['password'];
    loginValidate($loginEmail, $loginPassword, $con);
} else {
    exit(json_encode("ok"));
}

function loginValidate($email, $password, $con)
{
    // $emailValidateQuery = "SELECT email FROM admin WHERE email=?";
    $emailValidateQuery = $con->prepare("SELECT * FROM admin WHERE email=?");
    $emailValidateQuery->bind_param("s", $email);
    $emailValidateQuery->execute();

    $resultSet = $emailValidateQuery->get_result();
    $result = $resultSet->fetch_assoc();

    if ($result) {
        $serverEmail = $result['email'];
        $serverPassword = $result['password'];
        $serverStatus = $result['status'];
        if ($serverStatus == 't') {
            if (password_verify($password, $serverPassword)) {
                $final = array(
                    'sessionEmail' => $serverEmail,
                    'final' => 'Password Validated',
                    'email' => $serverEmail,
                    'password' => $password
                );
                exit(json_encode($final));
            }
            else {
                // exit(json_encode('password wrong'));
                $final = array(
                    'final' => 'password wrong'
                );
                exit(json_encode($final));
            }
        } else if($serverStatus=='p') {
            $final = array(
                'final' => 'Please Wait For validate your Account'
            );
            exit(json_encode($final));
            // exit(json_encode('Please Wait For validate your Account'));
        }
        else if($serverStatus=='f'){
            $final = array(
                'final' => 'Sorry This account was Blocked for security Purpose'
            );
            exit(json_encode($final));
            // exit(json_encode('Sorry This account was Blocked for security Purpose'));
        }

    } else {
        $final = array(
            'final' => 'No user'
        );
        exit(json_encode($final));
    }







}

function registerFunction($name, $email, $password, $mobile, $imageName, $con)
{
    $registerQuery = "INSERT INTO admin (name, email, password, mobile, photo, status) VALUES (?, ?, ?, ?, ?, 'p')";
    $registerStmt = mysqli_prepare($con, $registerQuery);

    if (!$registerStmt) {
        return 'failed to prepare statement';
    }

    mysqli_stmt_bind_param($registerStmt, "sssis", $name, $email, $password, $mobile, $imageName);

    $registerExecu = mysqli_stmt_execute($registerStmt);

    if ($registerExecu) {
        return 'success';
    } else {
        return 'failed to execute statement: ' . mysqli_error($con);
    }
}

function adminValidate($email, $con)
{
    $emailCheck = "SELECT * FROM admin WHERE email=?";
    $stmt = mysqli_prepare($con, $emailCheck);

    if (!$stmt) {
        return 'failed to prepare statement';
    }

    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);

    mysqli_stmt_store_result($stmt);
    $rows = mysqli_stmt_num_rows($stmt);

    if ($rows == 0) {
        return $emailCheckStatus = "false";
    } else {
        return $emailCheckStatus = "true";
    }
}
?>