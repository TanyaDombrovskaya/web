<?php
require_once 'dbConnect.php';

try {
    $loaderId = isset($_GET['loaderId']) ? (int)$_GET['loaderId'] : 0;
    
    if ($loaderId <= 0) {
        echo '<tr><td colspan="6" style="text-align: center; padding: 20px;">Выберите погрузчик</td></tr>';
        exit;
    }
    
    $sql = "SELECT 
                \"downTimeId\", 
                \"loaderId\", 
                \"dtStart\", 
                \"dtEnd\", 
                \"cause\", 
                \"dtAllTime\" 
            FROM \"downTimes\" 
            WHERE \"loaderId\" = :loaderId 
            ORDER BY \"downTimeId\" ASC";
    
    $stmt = $connection->prepare($sql);
    $stmt->execute(['loaderId' => $loaderId]);
    $downtimes = $stmt->fetchAll();

    if (empty($downtimes)) {
        echo '<tr><td colspan="6" style="text-align: center; padding: 20px;">Нет простоев для этого погрузчика</td></tr>';
    } else {
        foreach ($downtimes as $downtime) {
            $downTimeId = htmlspecialchars($downtime['downTimeId'] ?? '—');
            $cause = htmlspecialchars($downtime['cause'] ?? '—');
            
            $dtStart = '—';
            $dtEnd = '—';
            
            if (!empty($downtime['dtStart'])) {
                try {
                    $date = new DateTime($downtime['dtStart']);
                    $dtStart = $date->format('d.m.Y H:i');
                } catch (Exception $e) {
                    $dtStart = htmlspecialchars($downtime['dtStart']);
                }
            }
            
            if (!empty($downtime['dtEnd'])) {
                try {
                    $date = new DateTime($downtime['dtEnd']);
                    $dtEnd = $date->format('d.m.Y H:i');
                } catch (Exception $e) {
                    $dtEnd = htmlspecialchars($downtime['dtEnd']);
                }
            } else {
                $dtEnd = 'Действует';
            }
            
            $dtAllTime = '—';
            if (!empty($downtime['dtAllTime'])) {
                $parts = explode(':', $downtime['dtAllTime']);
                if (count($parts) >= 2) {
                    $hours = (int)$parts[0];
                    $minutes = (int)$parts[1];
                    
                    if ($hours > 0 && $minutes > 0) {
                        $dtAllTime = $hours . 'ч ' . $minutes . 'м';
                    } elseif ($hours > 0) {
                        $dtAllTime = $hours . 'ч';
                    } elseif ($minutes > 0) {
                        $dtAllTime = $minutes . 'м';
                    } else {
                        $dtAllTime = '0м';
                    }
                } else {
                    $dtAllTime = htmlspecialchars($downtime['dtAllTime']);
                }
            }
            
            echo '<tr>';
            echo '<td>' . $downTimeId . '</td>';
            echo '<td>' . $dtStart . '</td>';
            echo '<td>' . $dtEnd . '</td>';
            echo '<td>' . $dtAllTime . '</td>';
            echo '<td>' . $cause . '</td>';
            echo '<td>
                    <button class="edit-downtime-btn" data-id="' . $downTimeId . '" title="Редактировать">✎</button>
                    <button class="delete-downtime-btn" data-id="' . $downTimeId . '" title="Удалить">✖</button>
                  </td>';
            echo '</tr>';
        }
    }
} catch (PDOException $e) {
    echo '<tr><td colspan="6" style="color: red; text-align: center;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</td></tr>';
}
?>