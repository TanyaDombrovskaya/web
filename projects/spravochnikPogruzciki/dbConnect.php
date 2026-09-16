<?php
$host = "localhost";
$dbname = "spravochnikPogruzchikov";
$user = "postgres";
$password = "15022006";

try {
    $connection = new PDO(
        "pgsql:host=$host;dbname=$dbname",
        $user,
        $password
    );
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Ошибка: " . $e->getMessage();
}
?>