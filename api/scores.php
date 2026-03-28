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
    $data     = json_decode(file_get_contents('php://input'), true);
    $name     = htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $score    = (int)($data['score'] ?? 0);
    $total    = (int)($data['total'] ?? 0);
    $playerId = isset($data['player_id']) ? (int)$data['player_id'] : null;

    if (!$name || $total <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO quiz_scores (player_name, score, total_questions, player_id)
         VALUES (:name, :score, :total, :player_id)'
    );
    $stmt->execute([
        ':name'      => $name,
        ':score'     => $score,
        ':total'     => $total,
        ':player_id' => $playerId,
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

} else {
    // GET — return leaderboard or player-specific scores
    $playerId = isset($_GET['player_id']) ? (int)$_GET['player_id'] : null;

    if ($playerId) {
        // Return scores for a specific player
        $stmt = $pdo->prepare(
            'SELECT player_name AS name,
                    score,
                    total_questions AS total,
                    created_at
             FROM quiz_scores
             WHERE player_id = :pid
             ORDER BY created_at DESC
             LIMIT 20'
        );
        $stmt->execute([':pid' => $playerId]);
        echo json_encode(['scores' => $stmt->fetchAll()]);
    } else {
        // Return global leaderboard (best score per player)
        $stmt = $pdo->query(
            'SELECT player_name AS name,
                    MAX(score) AS score,
                    total_questions AS total,
                    COUNT(*) AS games_played
             FROM quiz_scores
             GROUP BY player_name, total_questions
             ORDER BY score DESC
             LIMIT 20'
        );
        echo json_encode(['scores' => $stmt->fetchAll()]);
    }
}
