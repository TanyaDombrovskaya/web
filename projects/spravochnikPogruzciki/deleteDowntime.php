<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $downTimeId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($downTimeId <= 0) {
        throw new Exception('Неверный ID простоя');
    }
    
    $checkSql = "SELECT \"downTimeId\" FROM \"downTimes\" WHERE \"downTimeId\" = :downTimeId";
    $checkStmt = $connection->prepare($checkSql);
    $checkStmt->execute(['downTimeId' => $downTimeId]);
    if (!$checkStmt->fetch()) {
        throw new Exception('Запись не найдена');
    }
    
    $sql = "DELETE FROM \"downTimes\" WHERE \"downTimeId\" = :downTimeId";
    $stmt = $connection->prepare($sql);
    $stmt->execute(['downTimeId' => $downTimeId]);
    
    echo json_encode(['success' => true, 'message' => 'Простой удален']);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>