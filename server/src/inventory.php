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

function getAllStatus() {
   $pdo = getConnection();
   $query = "SELECT DISTINCT status FROM items WHERE status != ''";
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount() > 0) {
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($data);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Az állapotok lekérdezése sikertelen volt."]);
   return;
}

function getAllPlaces() {
   $pdo = getConnection();
   $query = "SELECT DISTINCT place 
               FROM items 
               WHERE place != ''
               ORDER BY place ASC";
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount() > 0) {
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($data);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Az helyek lekérdezése sikertelen volt."]);
   return;
}

function getItemData($vars) {
   $pdo = getConnection();
   if ($vars["id"] === "empty") {
      $query = "SELECT * FROM items LIMIT 1";
      $stmt = $pdo->prepare($query);
      $stmt->execute([]);
   } else {
      $query = "SELECT * FROM items WHERE itemId = ?";
      $stmt = $pdo->prepare($query);
      $stmt->execute([$vars["id"]]);
   }
   
   if ($stmt->rowCount() > 0) {
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($data);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Nem létezik elem ezzel az azonosítóval."]);
   return;
}

function updateItem($vars, $body) {
   $pdo = getConnection();
   $update = "UPDATE items SET 
               name = ?,
               quantity = ?,
               place = ?,
               status = ?,
               ownerIsKK = ?,
               responsibilityLevel = ?,
               getInYear = ?,
               inventoryNr = ?,
               getFrom = ?,
               value = ?,
               description = ?,
               responsibleUser = ?
            WHERE itemId = ?";
   $stmt = $pdo->prepare($update);
   $stmt->execute([
      $body["itemData"]["name"],
      (int)$body["itemData"]["quantity"],
      $body["itemData"]["place"],
      $body["itemData"]["status"],
      (int)$body["itemData"]["ownerIsKK"],
      $body["itemData"]["responsibilityLevel"],
      $body["itemData"]["getInYear"],
      $body["itemData"]["inventoryNr"],
      $body["itemData"]["getFrom"],
      $body["itemData"]["value"],
      $body["itemData"]["description"],
      (int)$body["itemData"]["responsibleUser"],
      (int)$body["itemData"]["itemId"]
   ]);
   if ($stmt->rowCount() > 0) {
      echo json_encode(["id" => $body["itemData"]["itemId"]]);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Nem történt módosítás az elemen."]);
   return;
}

//Új leltári tétel mentése
function saveNewItem($vars, $body) {
   $pdo = getConnection();
   $insert = "INSERT INTO items (name, quantity, place, status, ownerIsKK, responsibilityLevel, getInYear, inventoryNr, getFrom, value, description, responsibleUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
   $stmt = $pdo->prepare($insert);
   $stmt->execute([
      $body["itemData"]["name"],
      (int)$body["itemData"]["quantity"],
      $body["itemData"]["place"],
      $body["itemData"]["status"],
      $body["itemData"]["ownerIsKK"] === "" ? NULL : (int)$body["itemData"]["ownerIsKK"],
      $body["itemData"]["responsibilityLevel"],
      $body["itemData"]["getInYear"],
      $body["itemData"]["inventoryNr"],
      $body["itemData"]["getFrom"],
      $body["itemData"]["value"],
      $body["itemData"]["description"],
      (int)$body["itemData"]["responsibleUser"]
   ]);
   if ($last_id = $pdo->lastInsertId()) {
      echo json_encode(["id" => $last_id]);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Az új tétel mentése sikertelen volt."]);
   return;
}

function deleteItem($vars) {
   $pdo = getConnection();
   $delete = "DELETE FROM items WHERE itemId = ?";
   $stmt = $pdo->prepare($delete);
   $stmt->execute([$vars['id']]);
   if ($stmt->rowCount() > 0) {
      echo json_encode(["id" => $vars['id']]);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Az elem törlése sikertelen volt."]);
   return;
}

?>