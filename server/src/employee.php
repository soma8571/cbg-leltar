<?php

function newEmployee($vars, $body) {
   $pdo = getConnection();
   $query = "INSERT INTO users (name, shortName) VALUES (?, ?)";
   $stmt = $pdo->prepare($query);
   $stmt->execute([
      $body['employee']['name'],
      $body['employee']['shortName']
   ]);
   $lastId = $pdo->lastInsertId();
   if ($lastId) {
      echo json_encode(['msg' => "Az új alkalmazott felvétele sikeres volt {$lastId} azonosítóval."]);
      return;
   }
   http_response_code(404);
   echo json_encode(['msg' => 'Hiba az alkalmazott felvétele során']);
   return;
}

function getEmployees() {
   $pdo = getConnection();
   $query = "SELECT * FROM users";
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount() > 0) {
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($data);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Nincs alkalmazott"]);
   return;
}

function deleteEmployee($vars) {
   $pdo = getConnection();
   $query = "DELETE FROM users WHERE userId = ?";
   $stmt = $pdo->prepare($query);
   $stmt->execute([$vars['id']]);
   if ($stmt->rowCount() > 0) {
      echo json_encode(["msg" => "Az alkalmazott törlésre került. ({$vars['id']})"]);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Az alkalmazott törlése sikertelen volt."]);
   return;
}

function getItems() {
   $pdo = getConnection();
   $query = "SELECT i.*, u.shortName, u.name AS userName
               FROM items i 
                  INNER JOIN users u
               ON i.responsibleUser = u.userId";
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount() > 0) {
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($data);
      return;
   }
   http_response_code(404);
   echo json_encode(["msg" => "Jelenleg nincs leltári elem."]);
   return;
}

?>