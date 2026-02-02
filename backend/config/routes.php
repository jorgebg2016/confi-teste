<?php

declare(strict_types=1);

use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {

    $app->options('/{routes:.+}', function ($request, $response) {
        return $response;
    });

    $app->get('/', function ($request, $response) {
        $response->getBody()->write(json_encode([
            'status' => 'ok',
            'message' => 'Confi Teste - API Backend',
            'version' => '1.0.0'
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->group('/api', function (RouteCollectorProxy $group) {

        $paths = [
            '/../src/Feature/Task/routes.php',
        ];

        foreach($paths as $path):
            $userRoutes = require __DIR__ . $path;
            $userRoutes($group);
        endforeach;
    });
};
