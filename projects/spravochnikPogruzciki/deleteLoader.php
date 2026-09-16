<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $loaderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($loaderId <= 0) {
        throw new Exception('Неверный ID');
    }
    
    $sql = "DELETE FROM loaders WHERE \"loaderId\" = :loaderId";
    $stmt = $connection->prepare($sql);
    $stmt->execute(['loaderId' => $loaderId]);
    
    echo json_encode(['success' => true, 'message' => 'Запись удалена']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>