<?php

declare(strict_types=1);

namespace App\Feature\Task\Controllers;

use App\Feature\Task\Services\TaskService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TaskController
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index(Request $request, Response $response): Response
    {
        $queryParams = $request->getQueryParams();
        $page = max(1, (int) ($queryParams['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($queryParams['per_page'] ?? 9)));

        $filters = [];
        if (!empty($queryParams['search'])) {
            $filters['search'] = trim($queryParams['search']);
        }
        if (!empty($queryParams['status'])) {
            $filters['status'] = $queryParams['status'];
        }

        $result = $this->taskService->findAllPaginated($page, $perPage, $filters);

        return $this->jsonResponse($response, [
            'success' => true,
            'data' => $result['items'],
            'pagination' => $result['pagination'],
        ]);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $task = $this->taskService->findById((int) $args['id']);

        return $this->jsonResponse($response, [
            'success' => true,
            'data' => $task,
        ]);
    }

    public function create(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody() ?? [];
        $task = $this->taskService->create($data);

        return $this->jsonResponse($response, [
            'success' => true,
            'message' => 'Tarefa criada com sucesso',
            'data' => $task,
        ], 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $data = $request->getParsedBody() ?? [];
        $task = $this->taskService->update((int) $args['id'], $data);

        return $this->jsonResponse($response, [
            'success' => true,
            'message' => 'Tarefa atualizada com sucesso',
            'data' => $task,
        ]);
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $this->taskService->delete((int) $args['id']);

        return $this->jsonResponse($response, [
            'success' => true,
            'message' => 'Tarefa excluída com sucesso',
        ]);
    }

    public function toggleStatus(Request $request, Response $response, array $args): Response
    {
        $task = $this->taskService->toggleStatus((int) $args['id']);

        return $this->jsonResponse($response, [
            'success' => true,
            'message' => 'Status da tarefa atualizado com sucesso',
            'data' => $task,
        ]);
    }

    private function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
