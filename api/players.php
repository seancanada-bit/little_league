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

// Helper: get stats for a player by id
function getPlayerStats(PDO $pdo, int $playerId): array {
    // Quiz stats
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) AS quiz_count,
                ROUND(AVG(score / total * 100), 1) AS quiz_avg
         FROM quiz_scores
         WHERE player_id = :pid AND total > 0'
    );
    $stmt->execute([':pid' => $playerId]);
    $quiz = $stmt->fetch();

    // Decision stats
    $stmt2 = $pdo->prepare(
        'SELECT COUNT(*) AS decision_total,
                SUM(correct) AS decision_correct
         FROM decision_scores
         WHERE player_id = :pid'
    );
    $stmt2->execute([':pid' => $playerId]);
    $dec = $stmt2->fetch();

    return [
        'quiz_count'       => (int)($quiz['quiz_count'] ?? 0),
        'quiz_avg'         => $quiz['quiz_avg'] !== null ? (float)$quiz['quiz_avg'] : null,
        'decision_correct' => (int)($dec['decision_correct'] ?? 0),
        'decision_total'   => (int)($dec['decision_total'] ?? 0),
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $name = trim($_GET['name'] ?? '');
    if ($name === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Name required']);
        exit;
    }

    $nameLower = strtolower($name);
    $stmt = $pdo->prepare('SELECT id, first_name FROM players WHERE first_name_lower = :nl LIMIT 1');
    $stmt->execute([':nl' => $nameLower]);
    $row = $stmt->fetch();

    if ($row) {
        $stats = getPlayerStats($pdo, (int)$row['id']);
        echo json_encode(array_merge(
            ['found' => true, 'id' => (int)$row['id'], 'first_name' => $row['first_name']],
            $stats
        ));
    } else {
        echo json_encode(['found' => false]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $raw  = trim($data['first_name'] ?? '');

    // Validate: letters only, 2-20 chars
    if (!preg_match('/^[A-Za-z]{2,20}$/', $raw)) {
        http_response_code(400);
        echo json_encode(['error' => 'Name must be 2-20 letters only']);
        exit;
    }

    // Capitalize first letter, rest lowercase
    $firstName = ucfirst(strtolower($raw));
    $nameLower = strtolower($raw);

    // Check if already exists
    $stmt = $pdo->prepare('SELECT id, first_name FROM players WHERE first_name_lower = :nl LIMIT 1');
    $stmt->execute([':nl' => $nameLower]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stats = getPlayerStats($pdo, (int)$existing['id']);
        echo json_encode(array_merge(
            ['created' => false, 'id' => (int)$existing['id'], 'first_name' => $existing['first_name']],
            $stats
        ));
    } else {
        $stmt = $pdo->prepare(
            'INSERT INTO players (first_name, first_name_lower) VALUES (:fn, :fnl)'
        );
        $stmt->execute([':fn' => $firstName, ':fnl' => $nameLower]);
        $newId = (int)$pdo->lastInsertId();
        echo json_encode(['created' => true, 'id' => $newId, 'first_name' => $firstName]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
