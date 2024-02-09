<?php

require_once('./connection.php');

// $_POST['reason'] = 'settingsData';
// $_POST['adminEmail'] = 'sankaran0311@gmail.com';
// // $_POST['userPassword'] = 'san';

function showtables($userEmail, $con) {
    $tableName = mysqli_real_escape_string($con, $userEmail); // Sanitize input
    $checkUserTable = $con->prepare("SHOW TABLES LIKE '$tableName'");
    $checkUserTable->execute();
    return $checkUserTable->get_result();
}

function fetchSettingsData($adminEmail,$con){
    $settingData = $con->prepare('SELECT * FROM admin WHERE email=? AND status="t" ');
    $settingData->bind_param('s',$adminEmail);
    $settingData->execute();
    $result = $settingData->get_result();
    $resultData = $result->fetch_assoc();
    return $resultData;
}

function countClient($adminEmail,$con){
    $countClientQuery = $con->prepare("SELECT COUNT(*) FROM `$adminEmail`");
    $countClientQuery->execute();
    $result = $countClientQuery->get_result();
    $resultData = $result->fetch_assoc();
    return $resultData;
}

function fetchTotalClient($adminEmail,$con,$status){
    if($status=='o'){
        $resultData[] = ['present'=>'true'];
        $fetchTotalClient = $con->prepare("SELECT * FROM `$adminEmail` WHERE status='$status'");
        $fetchTotalClient->execute();
        $result = $fetchTotalClient->get_result();
    }
    else{
        $fetchTotalClient = $con->prepare("SELECT * FROM `$adminEmail` WHERE status='$status' or status='d'");
        $fetchTotalClient->execute();
        $result = $fetchTotalClient->get_result();
    }
    
    if($result->num_rows>0){
        while($row = $result->fetch_assoc()){
            $resultData[] = $row ;
        }
        return $resultData;
    }
    else{
        exit(json_encode("NoRecord"));
    }
}


if ($_POST['reason'] == 'contentValidate') {
    if ($_POST['userEmail'] && $_POST['userPassword']) {
        $userEmail = $_POST['userEmail'];
        $userEmail = mysqli_real_escape_string($con, $userEmail);

        $validateEmailPassword = $con->prepare("SELECT * FROM admin WHERE email = ? AND status = 't'");
        $validateEmailPassword->bind_param('s', $userEmail); // Corrected line
        $validateEmailPassword->execute();
        $resultSet = $validateEmailPassword->get_result();
        $result = $resultSet->fetch_assoc();


        if ($resultSet->num_rows > 0) {
            $userPassword = $_POST['userPassword'];
            $userPassword = mysqli_real_escape_string($con, $userPassword);

            if (password_verify($userPassword, $result['password'])) {
                $checkAdminTable = showtables($userEmail,$con);
            if ($checkAdminTable->num_rows <= 0) {
                    exit('noUserFound');
            }
                $response = array(
                    'final' => 'userFound'
                );
                exit(json_encode($response));
            }
             else {
                $response = array(
                    'final' => 'wrongPassword'
                );
                exit(json_encode($response));
            }
        }
         else {
            $response = array(
                'final' => 'noUserFound'
            );
            exit(json_encode($response));
        }
    }
     else {
        $response = array(
            'final' => 'noUserFound'
        );
        exit(json_encode($response));
    }
}

else if($_POST['reason'] == 'settingsData'){
    $adminEmail = $_POST['adminEmail'];

    $settingsData = fetchSettingsData($adminEmail,$con);
    $image = $settingsData['photo'];
    $imagePath = "../userPic/" . $image;
    $countClient = countClient($adminEmail,$con);

    $settingsData[] = $countClient;
    

    exit(json_encode($settingsData));
}

else if($_POST['reason'] == 'client'){
    $adminEmail = $_POST['adminEmail'];
    $fetchTotalClient = fetchTotalClient($adminEmail,$con,'t');

    exit(json_encode($fetchTotalClient));
}

else if($_POST['reason'] == 'oldAccount'){
    $adminEmail = $_POST['adminEmail'];

    $fetchTotalOldClient = fetchTotalClient($adminEmail,$con,'o');



    exit(json_encode($fetchTotalOldClient));
}

else{
    exit(json_encode($_POST['reason']));
}





//d - daily complete
//t - true
//o - old ac
//f - waiting
?>