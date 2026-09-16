<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $brand = $_POST['brand'];
    $number = $_POST['number'];
    $weight = $_POST['weight'];
    $user = $_POST['user'];
    $active = $_POST['active'];
    
    if (empty($brand) || empty($number)) {
        throw new Exception('Марка и номер обязательны');
    }
    
    $sql = "INSERT INTO loaders (brand, number, weight, active, \"user\", \"dateTime\") 
            VALUES (:brand, :number, :weight, :active, :user, CURRENT_TIMESTAMP)";
    
    $stmt = $connection->prepare($sql);
    $stmt->execute([
        'brand' => $brand,
        'number' => $number,
        'weight' => $weight,
        'active' => $active,
        'user' => $user
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Запись добавлена']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>