<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $loaderId = $_POST['loaderId'];
    $dtStart = $_POST['dtStart'] ?? '';
    $dtEnd = $_POST['dtEnd'] ?? '';
    $cause = $_POST['cause'] ?? '';
    
    if ($loaderId <= 0) {
        throw new Exception('Неверный ID погрузчика');
    }
    
    if (empty($dtStart) || empty($dtEnd)) {
        throw new Exception('Укажите время начала и окончания простоя');
    }
    
    if (empty($cause)) {
        throw new Exception('Опишите причину простоя');
    }
    
    $startTime = new DateTime($dtStart);
    $endTime = new DateTime($dtEnd);
    
    if ($endTime <= $startTime) {
        throw new Exception('Время окончания должно быть позже времени начала');
    }

    $sql = "INSERT INTO \"downTimes\" (\"loaderId\", \"dtStart\", \"dtEnd\", cause) 
            VALUES (:loaderId, :dtStart, :dtEnd, :cause)";
    
    $stmt = $connection->prepare($sql);
    $stmt->execute([
        'loaderId' => $loaderId,
        'dtStart' => $dtStart,
        'dtEnd' => $dtEnd,
        'cause' => $cause
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Простой добавлен']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>