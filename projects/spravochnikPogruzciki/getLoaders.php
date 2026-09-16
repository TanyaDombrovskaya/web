<?php
require_once 'dbConnect.php';

try {
    $sql = "SELECT 
                \"loaderId\", 
                brand, 
                number, 
                active, 
                TO_CHAR(\"dateTime\", 'DD.MM.YYYY HH24:MI') AS \"dateTime\",
                \"user\", 
                weight 
            FROM loaders 
            ORDER BY \"loaderId\"";
    
    $stmt = $connection->prepare($sql);
    $stmt->execute();
    $loaders = $stmt->fetchAll();

    if (empty($loaders)) {
        echo '<tr><td colspan="8" style="text-align: center; padding: 20px;">Нет данных</td></tr>';
    } else {
        foreach ($loaders as $loader) {
            $activeStatus = $loader['active'] ? '✔' : '✖';
            
            $loaderId = htmlspecialchars($loader['loaderId'] ?? '—');
            $brand = htmlspecialchars($loader['brand'] ?? '—');
            $number = htmlspecialchars($loader['number'] ?? '—');
            $weight = htmlspecialchars($loader['weight'] ?? '—');
            $dateTime = htmlspecialchars($loader['dateTime'] ?? '—');
            $user = htmlspecialchars($loader['user'] ?? '—');
            
            echo '<tr>';
            echo '<td>' . $loaderId . '</td>';
            echo '<td>' . $brand . '</td>';
            echo '<td>' . $number . '</td>';
            echo '<td>' . $weight . '</td>';
            echo '<td>' . $activeStatus . '</td>';
            echo '<td>' . $dateTime . '</td>';
            echo '<td>' . $user . '</td>';
            echo '<td>
                    <div class="td-btn-container">
                        <button class="edit-btn" data-id="' . $loaderId . '" title="Редактировать">✎</button>
                        <button class="delete-btn" data-id="' . $loaderId . '" title="Удалить">✖</button>
                    </div>
                  </td>';
            echo '</tr>';
        }
    }
} catch (PDOException $e) {
    echo '<tr><td colspan="8" style="color: red; text-align: center;">Ошибка: ' . htmlspecialchars($e->getMessage()) . '</td></tr>';
}
?>