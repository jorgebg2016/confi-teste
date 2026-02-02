<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\ORMSetup;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use App\Feature\Task\Repositories\TaskRepository;
use App\Feature\Task\Services\TaskService;
use App\Feature\Task\Controllers\TaskController;
use App\Feature\Task\Validators\CreateTaskValidator;
use App\Feature\Task\Validators\UpdateTaskValidator;

return function (ContainerBuilder $containerBuilder, array $settings) {
    $containerBuilder->addDefinitions([
        'settings' => $settings,

        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get('settings')['logger'];
            $logger = new Logger($settings['name']);

            $logDir = dirname($settings['path']);
            if (!is_dir($logDir)) {
                mkdir($logDir, 0755, true);
            }

            $logger->pushHandler(new StreamHandler($settings['path'], $settings['level']));
            return $logger;
        },
        EntityManagerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get('settings');
            $doctrineSettings = $settings['doctrine'];
            $dbSettings = $settings['database'];

            if (!is_dir($doctrineSettings['cache_dir'])) {
                mkdir($doctrineSettings['cache_dir'], 0755, true);
            }
            if (!is_dir($doctrineSettings['proxy_dir'])) {
                mkdir($doctrineSettings['proxy_dir'], 0755, true);
            }

            $config = ORMSetup::createAttributeMetadataConfiguration(
                paths: $doctrineSettings['metadata_dirs'],
                isDevMode: $doctrineSettings['dev_mode'],
            );

            $config->setProxyDir($doctrineSettings['proxy_dir']);
            $config->setProxyNamespace('App\Proxies');

            $connection = DriverManager::getConnection([
                'driver' => $dbSettings['driver'],
                'host' => $dbSettings['host'],
                'port' => $dbSettings['port'],
                'dbname' => $dbSettings['dbname'],
                'user' => $dbSettings['user'],
                'password' => $dbSettings['password'],
                'charset' => $dbSettings['charset'],
            ], $config);

            return new EntityManager($connection, $config);
        },
        CreateTaskValidator::class => fn() => new CreateTaskValidator(),
        UpdateTaskValidator::class => fn() => new UpdateTaskValidator(),
        TaskRepository::class => function (ContainerInterface $c) {
            return new TaskRepository($c->get(EntityManagerInterface::class));
        },
        TaskService::class => function (ContainerInterface $c) {
            return new TaskService(
                $c->get(TaskRepository::class),
                $c->get(CreateTaskValidator::class),
                $c->get(UpdateTaskValidator::class)
            );
        },
        TaskController::class => function (ContainerInterface $c) {
            return new TaskController($c->get(TaskService::class));
        },
    ]);
};
