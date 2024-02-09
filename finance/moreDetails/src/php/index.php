<?php

require_once('connection.php');

function clientData($name,$con,$id,$adminEmail,$chitType){
    if($chitType==null){
        $fetchClientData = $con->prepare("SELECT * FROM `$adminEmail` WHERE id=? AND status = 't' OR status='d'");
        $fetchClientData->bind_param('i',$id);
    }
    else{
        $tableName = $name.'_'.$adminEmail;
        $fetchClientData = $con->prepare("SELECT * FROM `$tableName` WHERE chitType=? AND status='t'");
        $fetchClientData->bind_param('s',$chitType);
    }

    $fetchClientData->execute();
    $result = $fetchClientData->get_result();

    if($result->num_rows==0){
        return 'noData';
    }
    
    while($row = $result->fetch_assoc()){
        $resultData[] = $row;
    }

    return $resultData;

}

// $_POST['reason'] = 'clientData';
// $_POST['name'] = 'suresh';
// $_POST['id'] = 3;
// $_POST['adminEmail'] = 'sankaran031103@gmail.com';
// $_POST['chitType'] = 'week';


if($_POST['reason']=='clientData'){
    $name = $_POST['name'];
    $id = $_POST['id'];
    $adminEmail = $_POST['adminEmail'];

    $clientData = clientData($name,$con,$id,$adminEmail,null);

    exit(json_encode($clientData));
}
else if($_POST['reason']=='clientDataChitType'){
    $name = $_POST['name'];
    $id = $_POST['id'];
    $adminEmail = $_POST['adminEmail'];
    $chitType = $_POST['chitType'];

    $clientData = clientData($name,$con,$id,$adminEmail,$chitType);

    exit(json_encode($clientData));
}


else{
    exit(json_encode($_POST['reason']));
}
?>