<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$apiKey = getenv('ANTHROPIC_API_KEY');
if (!$apiKey) {
    // Try loading from .env in parent directory
    $envFile = dirname(__DIR__) . '/.env';
    if (file_exists($envFile)) {
        foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            if (strpos($line, 'ANTHROPIC_API_KEY=') === 0) {
                $apiKey = trim(substr($line, strlen('ANTHROPIC_API_KEY=')));
                break;
            }
        }
    }
}

if (!$apiKey) {
    http_response_code(500);
    echo json_encode([
        'error'    => 'API key not configured',
        'response' => 'Sorry, the coach is taking a break right now! Ask a parent to set up the API key.'
    ]);
    exit;
}

$data    = json_decode(file_get_contents('php://input'), true);
$message = trim($data['message'] ?? '');
$history = $data['history'] ?? [];

if (!$message) {
    http_response_code(400);
    echo json_encode(['error' => 'No message provided']);
    exit;
}

$systemPrompt = "You are Coach Claude, a friendly and encouraging baseball coach talking to a 10-year-old beginner.
Your job is to make baseball fun and easy to understand!

Rules:
- Use simple, friendly language that a 10-year-old can understand
- Keep answers short (2-4 sentences max)
- Use baseball emojis occasionally ⚾🏆🎯
- Be enthusiastic and encouraging
- If asked about something not related to baseball, gently redirect: 'Great question, but let's keep our heads in the game! Ask me anything about baseball!'
- Explain terms in simple language
- Relate concepts to things kids know (running fast, throwing, catching)
- Never use adult language or discuss anything inappropriate";

$messages = [];
foreach ($history as $h) {
    if (in_array($h['role'] ?? '', ['user', 'assistant'])) {
        $messages[] = [
            'role'    => $h['role'],
            'content' => htmlspecialchars_decode($h['content'] ?? '', ENT_QUOTES)
        ];
    }
}

// Make sure last message is the current one
if (empty($messages) || end($messages)['content'] !== $message) {
    $messages[] = ['role' => 'user', 'content' => $message];
}

$payload = json_encode([
    'model'      => 'claude-3-5-haiku-20241022',
    'max_tokens' => 300,
    'system'     => $systemPrompt,
    'messages'   => $messages,
]);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT        => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    $apiError = json_decode($response, true);
    echo json_encode([
        'error'    => 'Claude API error',
        'detail'   => $apiError['error']['message'] ?? $response,
        'response' => "Hmm, Coach is thinking too hard right now! Try again in a moment. ⚾"
    ]);
    exit;
}

$result  = json_decode($response, true);
$content = $result['content'][0]['text'] ?? "I had trouble answering that. Ask me another baseball question!";

echo json_encode(['response' => $content]);
