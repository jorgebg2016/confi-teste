<?php

declare(strict_types=1);

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

return [
    'app' => [
        'env' => $_ENV['APP_ENV'] ?? 'production',
        'debug' => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
    ],
    'database' => [
        'driver' => $_ENV['DB_DRIVER'] ?? 'pdo_mysql',
        'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
        'port' => (int) ($_ENV['DB_PORT'] ?? 3306),
        'dbname' => $_ENV['DB_NAME'] ?? 'confi_back_db',
        'user' => $_ENV['DB_USER'] ?? 'root',
        'password' => $_ENV['DB_PASSWORD'] ?? '',
        'charset' => $_ENV['DB_CHARSET'] ?? 'utf8mb4',
    ],
    'doctrine' => [
        'dev_mode' => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
        'metadata_dirs' => [
            dirname(__DIR__) . '/src/Feature/Task/Entities',
        ],
        'cache_dir' => dirname(__DIR__) . '/var/cache/doctrine',
        'proxy_dir' => dirname(__DIR__) . '/var/cache/doctrine/proxies',
    ],
    'logger' => [
        'name' => 'app',
        'path' => dirname(__DIR__) . '/var/logs/app.log',
        'level' => \Monolog\Level::Debug,
    ],
];
