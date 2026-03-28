<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load .env from project root
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);
            if (!array_key_exists($key, $_ENV)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

$host   = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'baseball_coach';
$user   = getenv('DB_USER') ?: 'root';
$pass   = getenv('DB_PASS') ?: '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data       = json_decode(file_get_contents('php://input'), true);
    $playerId   = (int)($data['player_id'] ?? 0);
    $scenarioId = trim($data['scenario_id'] ?? '');
    $correct    = isset($data['correct']) ? (int)(bool)$data['correct'] : 0;

    if (!$playerId || $scenarioId === '') {
        http_response_code(400);
        echo json_encode(['error' => 'player_id and scenario_id are required']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO decision_scores (player_id, scenario_id, correct)
         VALUES (:pid, :sid, :correct)'
    );
    $stmt->execute([
        ':pid'     => $playerId,
        ':sid'     => $scenarioId,
        ':correct' => $correct,
    ]);

    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $playerId = (int)($_GET['player_id'] ?? 0);

    if (!$playerId) {
        http_response_code(400);
        echo json_encode(['error' => 'player_id required']);
        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT scenario_id,
                COUNT(*) AS total,
                SUM(correct) AS correct_count
         FROM decision_scores
         WHERE player_id = :pid
         GROUP BY scenario_id
         ORDER BY scenario_id'
    );
    $stmt->execute([':pid' => $playerId]);
    $rows = $stmt->fetchAll();

    // Cast numeric strings to ints
    $result = array_map(function($row) {
        return [
            'scenario_id'   => $row['scenario_id'],
            'total'         => (int)$row['total'],
            'correct_count' => (int)$row['correct_count'],
        ];
    }, $rows);

    echo json_encode($result);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
