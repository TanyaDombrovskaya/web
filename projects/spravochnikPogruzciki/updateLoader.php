<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $loaderId = $_POST['loaderId'];
    $brand = $_POST['brand'];
    $number = $_POST['number'];
    $weight = $_POST['weight'];
    $active = $_POST['active'];
    $user = $_POST['user'];
    
    if ($loaderId <= 0) {
        throw new Exception('Неверный ID');
    }
    
    if (empty($brand) || empty($number)) {
        throw new Exception('Марка и номер обязательны');
    }
    
    $sql = "UPDATE loaders 
            SET brand = :brand, 
                number = :number, 
                weight = :weight, 
                active = :active, 
                \"user\" = :user,
                \"dateTime\" = CURRENT_TIMESTAMP
            WHERE \"loaderId\" = :loaderId";
    
    $stmt = $connection->prepare($sql);
    $stmt->execute([
        'loaderId' => $loaderId,
        'brand' => $brand,
        'number' => $number,
        'weight' => $weight,
        'active' => $active,
        'user' => $user
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Запись обновлена']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>