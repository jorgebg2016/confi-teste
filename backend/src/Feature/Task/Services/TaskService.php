<?php

declare(strict_types=1);

namespace App\Feature\Task\Services;

use App\Feature\Task\Entities\Task;
use App\Feature\Task\Repositories\TaskRepository;
use App\Feature\Task\Validators\CreateTaskValidator;
use App\Feature\Task\Validators\UpdateTaskValidator;
use App\Shared\Exceptions\NotFoundException;

class TaskService
{
    public function __construct(
        private TaskRepository $taskRepository,
        private CreateTaskValidator $createValidator,
        private UpdateTaskValidator $updateValidator
    ) {}

    public function findAllPaginated(int $page = 1, int $perPage = 10): array
    {
        $tasks = $this->taskRepository->findPaginated($page, $perPage);
        $total = $this->taskRepository->count();
        $totalPages = (int) ceil($total / $perPage);

        return [
            'items' => array_map(fn(Task $task) => $task->toArray(), $tasks),
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => $totalPages,
            ],
        ];
    }

    public function findById(int $id): array
    {
        $task = $this->taskRepository->find($id);

        if ($task === null) {
            throw new NotFoundException('Tarefa não encontrada');
        }

        return $task->toArray();
    }

    public function create(array $data): array
    {
        $this->createValidator->validate($data);

        $task = new Task();
        $task->setTitle($data['title']);

        if (isset($data['description'])) {
            $task->setDescription($data['description']);
        }

        if (isset($data['status']) && in_array($data['status'], [Task::STATUS_PENDENTE, Task::STATUS_CONCLUIDO])) {
            $task->setStatus($data['status']);
        }

        $this->taskRepository->save($task);

        return $task->toArray();
    }

    public function update(int $id, array $data): array
    {
        $task = $this->taskRepository->find($id);

        if ($task === null) {
            throw new NotFoundException('Tarefa não encontrada');
        }

        $this->updateValidator->validate($data);

        if (isset($data['title'])) {
            $task->setTitle($data['title']);
        }

        if (array_key_exists('description', $data)) {
            $task->setDescription($data['description']);
        }

        if (isset($data['status']) && in_array($data['status'], [Task::STATUS_PENDENTE, Task::STATUS_CONCLUIDO])) {
            $task->setStatus($data['status']);
        }

        $this->taskRepository->save($task);

        return $task->toArray();
    }

    public function delete(int $id): void
    {
        $task = $this->taskRepository->find($id);

        if ($task === null) {
            throw new NotFoundException('Tarefa não encontrada');
        }

        $this->taskRepository->delete($task);
    }

    public function toggleStatus(int $id): array
    {
        $task = $this->taskRepository->find($id);

        if ($task === null) {
            throw new NotFoundException('Tarefa não encontrada');
        }

        $task->toggleStatus();
        $this->taskRepository->save($task);

        return $task->toArray();
    }
}
