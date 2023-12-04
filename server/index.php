<?php

require __DIR__."/src/common.php";

$folder = "";
if ($_SERVER['SERVER_NAME'] === "localhost") {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    $folder = "/cbg-leltar/";
} else {
    header("Access-Control-Allow-Origin: https://cbg.edu.hu");
    $folder = "/";
}

header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS, DELETE");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Origin, Pragma, Cache-control, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Válasz az OPTIONS kérésre
    header("HTTP/1.1 200 OK");
    exit;
}

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) use ($folder) {
    
    /* LOGIN */
    $r->addRoute('POST', $folder.'server/login', 'login');

    /* Employees */
    $r->addRoute('POST', $folder.'server/new-employee', 'newEmployee');
    $r->addRoute('GET', $folder.'server/get-employees', 'getEmployees');
    $r->addRoute('DELETE', $folder.'server/delete-employee/{id}', 'deleteEmployee');
    
    /* Inventory */
    $r->addRoute('POST', $folder.'server/new-items', 'saveNewItems');
    //visszaadja az adatbázisban tárolt összes leltári tárgyat
    $r->addRoute('GET', $folder.'server/get-items', 'getItems');
    //visszaadja az összes lehetséges egyedi (leltári tárgyra vonatkozó) állapotot
    $r->addRoute('GET', $folder.'server/get-status', 'getAllStatus');
    //visszaadja az összes egyedi hely (place) tulajdonságot
    $r->addRoute('GET', $folder.'server/get-places', 'getAllPlaces');
    //visszaadja a paraméterben érkező azonítójú leltári elem összes adatát
    $r->addRoute('GET', $folder.'server/get-item-data/{id}', 'getItemData');
    //egy adott leltári elem módosítására szolgáló útvonal
    $r->addRoute('PATCH', $folder.'server/update-item', 'updateItem');
    //új leltári tétel mentése
    $r->addRoute('POST', $folder.'server/save-new-item', 'saveNewItem');
    //leltári elem törlése
    $r->addRoute('DELETE', $folder.'server/delete-item/{id}', 'deleteItem');
   
});


$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$routeInfo = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $path);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        // ... 404 Not Found
        echo json_encode(["msg" => "Error. This route does not exists."]);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        // ... 405 Method Not Allowed
        echo json_encode(["msg" => "Error. This method not allowed."]);
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        // ... call $handler with $vars
        $body = json_decode(file_get_contents('php://input'), true);
        $handler($vars, $body);
        break;
}

function home() {
    
    /* $pdo = getConnection();
    $query = "";
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    //echo json_encode(["msg" => "home lefut"]); */
    echo json_encode(["msg" => "home lefut"]);
}

function getConnection() {
    
    try {
        $conn = new PDO(
            "mysql:host=" . $_SERVER['DB_HOST'] . 
            ";dbname=" . $_SERVER['DB_NAME'], 
            $_SERVER['DB_USER'], 
            $_SERVER['DB_PASS']);
        $query = "SET NAMES UTF8";
        $statement = $conn->prepare($query);
        $statement->execute();
        return $conn;

    } catch (PDOException $e) {
        echo json_encode(["DB connection error: " => $e->getMessage()]);
    }
}

function login($vars, $body) {

    
    if (isset($body['loginData']['username']) && 
        $body['loginData']['username'] === "admin" &&
        isset($body['loginData']['password']) && 
        $body['loginData']['password'] === "szuperTitkos")
    {
        /* setcookie(
            "loggedIn",
            true,
            3600
        ); */
        echo json_encode(["msg" => "ok"]);
        return;
    }
    http_response_code(401);
    echo json_encode(["msg" => "Helytelen bejelentkezési adatok."]);
}

?>