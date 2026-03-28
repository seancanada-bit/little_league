<?php
/**
 * GitHub Webhook Deploy Script
 * URL: https://pacificlogo.ca/sandbox/baseball-coach/deploy.php
 * Set in GitHub: Settings > Webhooks > Payload URL
 */

$secret  = getenv('DEPLOY_SECRET') ?: 'change-me-to-a-random-string';
$logFile = __DIR__ . '/deploy.log';
$repoDir = __DIR__;

// Verify GitHub signature
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload   = file_get_contents('php://input');
$expected  = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expected, $signature)) {
    http_response_code(403);
    file_put_contents($logFile, date('Y-m-d H:i:s') . " FORBIDDEN: bad signature\n", FILE_APPEND);
    exit('Forbidden');
}

$data   = json_decode($payload, true);
$branch = $data['ref'] ?? '';

// Only deploy on push to main
if ($branch !== 'refs/heads/main') {
    echo 'Skipped: not main branch';
    exit;
}

$timestamp = date('Y-m-d H:i:s');
file_put_contents($logFile, "$timestamp Deploy started\n", FILE_APPEND);

$commands = [
    "cd $repoDir && git pull origin main 2>&1",
    "cd $repoDir && npm ci 2>&1",
    "cd $repoDir && npm run build 2>&1",
];

$output = [];
foreach ($commands as $cmd) {
    $result = shell_exec($cmd);
    $output[] = $cmd . "\n" . $result;
    file_put_contents($logFile, "$timestamp CMD: $cmd\nOUT: $result\n", FILE_APPEND);
}

echo "Deploy complete!\n" . implode("\n---\n", $output);
