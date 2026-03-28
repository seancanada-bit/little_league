<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load .env
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

// GET ?code=XXXX — validate a team access code
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $code = trim($_GET['code'] ?? '');
    $slug = trim($_GET['slug'] ?? '');

    if ($code === '' && $slug === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Provide code or slug']);
        exit;
    }

    if ($code !== '') {
        $stmt = $pdo->prepare(
            'SELECT id, team_name, slug, league_name, plan, active, max_players, expires_at
             FROM teams WHERE access_code = :code LIMIT 1'
        );
        $stmt->execute([':code' => $code]);
    } else {
        $stmt = $pdo->prepare(
            'SELECT id, team_name, slug, league_name, plan, active, max_players, expires_at
             FROM teams WHERE slug = :slug LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
    }

    $team = $stmt->fetch();

    if (!$team) {
        echo json_encode(['found' => false]);
        exit;
    }

    // Check if expired
    $expired = false;
    if ($team['expires_at'] && strtotime($team['expires_at']) < time()) {
        $expired = true;
    }

    // Count current players on this team
    $countStmt = $pdo->prepare('SELECT COUNT(*) AS cnt FROM players WHERE team_id = :tid');
    $countStmt->execute([':tid' => $team['id']]);
    $playerCount = (int)$countStmt->fetch()['cnt'];

    echo json_encode([
        'found'        => true,
        'id'           => (int)$team['id'],
        'team_name'    => $team['team_name'],
        'slug'         => $team['slug'],
        'league_name'  => $team['league_name'],
        'plan'         => $team['plan'],
        'active'       => (bool)$team['active'],
        'expired'      => $expired,
        'player_count' => $playerCount,
        'max_players'  => (int)$team['max_players'],
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
