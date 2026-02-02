<?php

declare(strict_types=1);

use Slim\App;
use App\Shared\Middleware\JsonBodyParser;
use App\Shared\Middleware\ExceptionHandler;
use Psr\Log\LoggerInterface;

return function (App $app) {
    $container = $app->getContainer();
    $settings = $container->get('settings');
    $logger = $container->get(LoggerInterface::class);

    $app->add(new JsonBodyParser());

    $app->add(function ($request, $handler) {
        $response = $handler->handle($request);
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    });

    $app->addRoutingMiddleware();

    $errorMiddleware = $app->addErrorMiddleware(
        $settings['app']['debug'],
        true,
        true
    );

    $errorHandler = new ExceptionHandler($settings['app']['debug'], $logger);
    $errorMiddleware->setDefaultErrorHandler($errorHandler);
};
