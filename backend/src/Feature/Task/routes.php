<?php

declare(strict_types=1);

use Slim\Routing\RouteCollectorProxy;
use App\Feature\Task\Controllers\TaskController;

return function (RouteCollectorProxy $group) {
    $group->group('/tasks', function (RouteCollectorProxy $group) {
        $group->get('', [TaskController::class, 'index']);
        $group->get('/{id:[0-9]+}', [TaskController::class, 'show']);
        $group->post('', [TaskController::class, 'create']);
        $group->put('/{id:[0-9]+}', [TaskController::class, 'update']);
        $group->delete('/{id:[0-9]+}', [TaskController::class, 'delete']);
        $group->patch('/{id:[0-9]+}/status', [TaskController::class, 'toggleStatus']);
    });
};
