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
   http_response_code(401);
   echo json_encode(['msg' => 'Hiba az alkalmazott felvétele során']);
   return;
}

function getEmployees() {
   $pdo = getConnection();
   $query = "SELECT * FROM users";
   $stmt = $pdo->prepare($query);
   $stmt->execute([]);
   if ($stmt->rowCount()) {
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($data);
      return;
   }
   http_response_code(401);
   echo json_encode(["msg" => "Nincs alkalmazott"]);
   return;
}

?>