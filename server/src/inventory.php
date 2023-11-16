<?php

function saveNewItems($vars, $body) {
   $pdo = getConnection();
   try {
      $pdo->beginTransaction();
      $items = $body['items'];
      $itemNr = count($items);
      for ($i=0; $i < count($items); $i++) {
         saveItem($items[$i], $pdo);
      }
      $pdo->commit();
      echo json_encode(["msg" => "{$itemNr} elem sikeresen mentésre került."]);
   } catch (Exception $e) {
      $pdo->rollBack();
      http_response_code(404);
      echo json_encode(["error" => "Hiba az adatok rögzítése során."]);
      return;
   }
}

function saveItem($item, $pdo) {
   $insert = "INSERT INTO items (name, quantity, place, status, ownerIsKK, responsibilityLevel, getInYear, inventoryNr, getFrom, value, description, responsibleUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
   $stmt = $pdo->prepare($insert);
   $stmt->execute([
      $item['name'],
      $item['quantity'],
      $item['place'],
      $item['status'],
      $item['ownerIsKK'],
      $item['responsibilityLevel'],
      $item['getInYear'],
      $item['inventoryNr'],
      $item['getFrom'],
      $item['value'],
      $item['description'],
      $item['responsibleUser']
   ]);
   return $pdo->lastInsertId();
   
}

?>