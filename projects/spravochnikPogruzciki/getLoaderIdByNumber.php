<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $number = isset($_GET['number']) ? trim($_GET['number']) : '';
    
    if (empty($number)) {
        throw new Exception('Не указан номер погрузчика');
    }
    
    $sql = "SELECT \"loaderId\" FROM loaders WHERE number = :number LIMIT 1";
    $stmt = $connection->prepare($sql);
    $stmt->execute(['number' => $number]);
    $result = $stmt->fetch();
    
    if ($result) {
        echo json_encode(['success' => true, 'loaderId' => $result['loaderId']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Погрузчик не найден']);
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>