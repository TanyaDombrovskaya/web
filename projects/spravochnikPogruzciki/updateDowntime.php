<?php
require_once 'dbConnect.php';

header('Content-Type: application/json');

try {
    $downTimeId = isset($_POST['downTimeId']) ? (int)$_POST['downTimeId'] : 0;
    $dtStart = $_POST['dtStart'] ?? '';
    $dtEnd = $_POST['dtEnd'] ?? '';
    $cause = $_POST['cause'] ?? '';
    
    if ($downTimeId <= 0) {
        throw new Exception('Неверный ID простоя');
    }
    
    if (empty($dtStart)) {
        throw new Exception('Укажите время начала простоя');
    }
    
    if (empty($dtEnd)) {
        throw new Exception('Укажите время окончания простоя');
    }
    
    if (empty($cause)) {
        throw new Exception('Опишите причину простоя');
    }
    
    $startTime = new DateTime($dtStart);
    $endTime = new DateTime($dtEnd);
    
    if ($endTime <= $startTime) {
        throw new Exception('Время окончания должно быть позже времени начала');
    }

    $checkSql = "SELECT \"downTimeId\" FROM \"downTimes\" WHERE \"downTimeId\" = :downTimeId";
    $checkStmt = $connection->prepare($checkSql);
    $checkStmt->execute(['downTimeId' => $downTimeId]);
    if (!$checkStmt->fetch()) {
        throw new Exception('Запись не найдена');
    }
    
    $sql = "UPDATE \"downTimes\" 
            SET \"dtStart\" = :dtStart, 
                \"dtEnd\" = :dtEnd, 
                cause = :cause 
            WHERE \"downTimeId\" = :downTimeId";
    
    $stmt = $connection->prepare($sql);
    $stmt->execute([
        'downTimeId' => $downTimeId,
        'dtStart' => $dtStart,
        'dtEnd' => $dtEnd,
        'cause' => $cause
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Простой обновлен']);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>