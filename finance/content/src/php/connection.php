<?php

// Connect to the MySQL server.
$con = mysqli_connect('localhost', 'root', '');

// Define the database name.
$DBName = 'finance';


$useDBQuery = "USE `$DBName`";
$useDBExecu = mysqli_query($con, $useDBQuery);






?>