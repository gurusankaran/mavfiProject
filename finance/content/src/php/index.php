<?php

include_once("connection.php");
$_POST['reason'] = 'update';


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
                    createAdmin($userEmail,$con);
                // exit(json_encode($checkAdminTable->num_rows));
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

else if ($_POST['reason'] == 'holderRegister') {
    $adminEmail = mysqli_real_escape_string($con, $_POST['adminEmail']);
    $holderName = mysqli_real_escape_string($con, $_POST['holderName']);
    $holderDate = mysqli_real_escape_string($con, $_POST['holderDate']);
    $holderAmount = mysqli_real_escape_string($con, $_POST['holderAmount']);
    $holderInterest = mysqli_real_escape_string($con, $_POST['holderInterest']);
    $holderChitType = mysqli_real_escape_string($con, $_POST['holderChitType']);

    $holderValidate = $con->prepare("SELECT * FROM `$adminEmail` WHERE name=? and totalAmount=? and chitType=?  and `date`=? and interest=? and status='t'");
    $holderValidate->bind_param('sissi', $holderName,$holderAmount, $holderChitType, $holderDate, $holderInterest);
    $holderValidate->execute();
    $numOfData = $holderValidate->get_result();

    if ($numOfData->num_rows > 0) {
        $response = array(
            'final' => 'alreadyCreated'
        );
    }
    
    else if ($numOfData->num_rows <= 0) {
        $insertNewHolder = $con->prepare("INSERT INTO `$adminEmail` (name, totalAmount, `date`, interest, chitType, paidAmount,status) VALUES (?, ?, ?, ?, ?, 0, 't')");
        $insertNewHolder->bind_param('sisis', $holderName, $holderAmount, $holderDate, $holderInterest, $holderChitType);
        $insertNewHolderResult = $insertNewHolder->execute();

        if ($insertNewHolderResult) {
            $holderTableName = $holderName . '_' . $adminEmail;
            $checkHolderTable = $con->prepare("SHOW TABLES LIKE '$holderTableName'");
            $checkHolderTable->execute();
            $checkHolderTableResult = $checkHolderTable->get_result();


            if ($checkHolderTableResult->num_rows == 0) {
                $createHolderTable = $con->prepare("CREATE TABLE `$holderTableName` (
                    id int PRIMARY KEY AUTO_INCREMENT,
                    `date` varchar(10) NOT NULL,
                    amount int NOT NULL,
                    chitType varchar(10) NOT NULL,
                    status char(1) NOT NULL
                )");
                $createHolderTable->execute();
            }
        }

        $response = array(
            'final' => 'inserted'
        );
    }
    exit(json_encode($response));


}

else if ($_POST['reason'] == 'tableData') {

    $chitType = mysqli_real_escape_string($con, $_POST['chitTypeValue']);
    $adminEmail = mysqli_real_escape_string($con, $_POST['userEmail']);


    if($_POST['searchName']!=='null'){
        $searchName = mysqli_real_escape_string($con,$_POST['searchName']);
        $searchingName = "%$searchName%";

        $getDataForTable = $con->prepare("SELECT * FROM `$adminEmail` WHERE chitType=? AND status='t' AND name LIKE ?");
        $getDataForTable->bind_param('ss', $chitType,$searchingName);
        // exit(json_encode('Seacrh'));

    }
    else{
        $getDataForTable = $con->prepare("SELECT * FROM `$adminEmail` WHERE chitType=? AND status='t'");
        $getDataForTable->bind_param('s', $chitType);
        // exit(json_encode('No Seacrh'));
    }
    $getDataForTable->execute();
    $result = $getDataForTable->get_result();

    if ($result->num_rows > 0) {
    $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $response = array(
            'final' => 'tableDataPresent',
            'data' => $data
        );

    } else if ($result->num_rows <= 0) {
        $response = array(
            'final' => 'noTableData'
        );
    }

    exit(json_encode($response));
}

else if($_POST['reason']=='credit'){
    $adminEmail = $_POST['adminEmail'];
    $inputId = $_POST['inputId'];
    $inputName = $_POST['inputName'];
    $inputAmount = $_POST['inputAmount'];
    $chitType = $_POST['chitType'];

    $chitTypeTableName = $inputName."_".$adminEmail;
    $todayDate = date('d-m-Y');

    $creditResult = credit($inputId,$inputName,$inputAmount,$con,"t",$adminEmail,$chitTypeTableName,$todayDate,$chitType);

    exit(json_encode($creditResult));
}

else if($_POST['reason']=='changeStatus'){
    $adminEmail = $_POST['adminEmail'];
    
    autoStatusChange($adminEmail,$con);
    exit(json_encode('statusUpdated'));
}

else if($_POST['reason']=='dailyCredits'){
    $adminEmail = $_POST['adminEmail'];
    $chitType = $_POST['chitType'];
    adminNameList($con,$adminEmail,$chitType);
}


else if($_POST['reason']=='update'){
$_POST['adminEmail'] = 'km007914@gmail.com';
$_POST['newAmount'] = 200;
$_POST['chitType'] = 'daily';
$_POST['name'] = 'sankaran';
$_POST['oldAmount'] = 100;
$_POST['id'] = 1;

    $name = $_POST['name'];
    $newAmount = $_POST['newAmount'];
    $adminEmail = $_POST['adminEmail'];
    $id = $_POST['id'];
    $chitType = $_POST['chitType'];
    $oldAmount = $_POST['oldAmount'];

    updateCredit($con,$name,$id,$adminEmail,$newAmount,$chitType,$oldAmount);
}

else {
    exit(json_encode($_POST['reason']));
}

function updateCredit($con,$name,$id,$adminEmail,$newAmount,$chitType,$oldAmount){
    $tableName = $name."_".$adminEmail;
    $todayDate = date('d-m-Y');
    // $updateQuery = $con->prepare("UPDATE `$tableName` SET amount = ? WHERE amount = ? AND id = ? AND date = ? AND chitType = ? AND status='t'");
    // $updateQuery->bind_param('iiiss',$newAmount,$oldAmount,$id,$todayDate,$chitType);
    // $updateQuery->execute();

    $updateInAdminTable = $con->prepare("UPDATE `$adminEmail` SET paidAmount=? WHERE name = ? AND chitType=? AND paidAmount=? AND status = 't'");
    $updateInAdminTable->bind_param('issi', $newAmount, $name, $chitType, $oldAmount);
    $updateInAdminTable->execute();

    print_r($adminEmail);
    // adminNameList($con,$adminEmail,$chitType);
}

function adminNameList($con,$adminEmail,$chitType){
    $dailyCreditQuery = $con->prepare("SELECT name,totalAmount FROM `$adminEmail` WHERE status='d'");
    $dailyCreditQuery->execute();
    $result =  $dailyCreditQuery->get_result();
    
    if($result->num_rows>0){
        $data = array();
        while($row = $result->fetch_assoc()){
            $data[] = $row;
        }
    }
    else{
        exit(json_encode('noData'));
    }

    // exit(json_encode($data));
    dailyCreditList($con,$adminEmail,$chitType,$data);
}

function dailyCreditList($con, $adminEmail, $chitType, $data){
    $todayCreditList = array();
    $date = date('d-m-Y');
    foreach($data as $row){
        $tableName = $row['name']."_".$adminEmail;
        $listQuery = $con->prepare("SELECT * FROM `$tableName` WHERE `date`=? AND chitType=? AND status='t'");
        $listQuery->bind_param('ss', $date, $chitType);
        $listQuery->execute();
        $result = $listQuery->get_result();
        if($result->num_rows > 0){
            while($row1 = $result->fetch_assoc()){
                $row1['name'] = $row['name'];
                $row1['totalAmount'] = $row['totalAmount'];
                $uniqueIdentifier = $row1['id'];
                if(!isset($todayCreditList[$uniqueIdentifier])) {
                    $todayCreditList[$uniqueIdentifier] = $row1;
                }
            }
        }

    }
    exit(json_encode(array_values($todayCreditList)));
}


function credit($inputId,$inputName,$inputAmount,$con,$status,$adminEmail,$chitTypeTableName,$todayDate,$chitType){
    $creditUpdate = $con->prepare("UPDATE `$adminEmail` SET paidAmount=paidAmount+?, status='d' WHERE id=? AND name=? AND status='$status'");
    $creditUpdate->bind_param('iis',$inputAmount,$inputId,$inputName);
    $creditUpdate->execute();

    $updateChitType = $con->prepare("INSERT INTO `$chitTypeTableName`(date,amount,chitType,status) VALUES(?,?,?,'t')");
    $updateChitType->bind_param('sis',$todayDate,$inputAmount,$chitType);
    // $updateChitType->execute();
        

    if($updateChitType->execute()){
        return 'updated';
    }
    else{
        return 'updateFailed';
    }
}

function showtables($userEmail, $con) {
    $tableName = mysqli_real_escape_string($con, $userEmail); // Sanitize input
    $checkUserTable = $con->prepare("SHOW TABLES LIKE '$tableName'");
    $checkUserTable->execute();
    return $checkUserTable->get_result();
}

function autoStatusChange($adminEmail,$con){
    $changeStatus = $con->prepare("UPDATE `$adminEmail` SET status='t' WHERE status='d'");
    $changeStatus->execute();
}


function createAdmin($userEmail,$con){
    $createUserTable = $con->prepare("CREATE TABLE `$userEmail` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        paidAmount INT NOT NULL,
        totalAmount INT NOT NULL,
        chitType varchar(10) NOT NULL,
        interest INT NOT NULL,
        `date` VARCHAR(15) NOT NULL,
        status CHAR(1) NOT NULL
    )");
        return $createUserTable->execute();
}
?>