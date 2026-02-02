<?php

declare(strict_types=1);

namespace App\Feature\Task\Repositories;

use App\Feature\Task\Entities\Task;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class TaskRepository
{
    private EntityRepository $repository;

    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
        $this->repository = $entityManager->getRepository(Task::class);
    }

    public function findAll(): array
    {
        return $this->repository->findBy([], ['created_at' => 'DESC']);
    }

    public function findPaginated(int $page = 1, int $perPage = 10, array $filters = []): array
    {
        $queryBuilder = $this->entityManager->createQueryBuilder();

        $queryBuilder
            ->select('t')
            ->from(Task::class, 't')
            ->orderBy('t.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $perPage)
            ->setMaxResults($perPage);

        $this->applyFilters($queryBuilder, $filters);

        return $queryBuilder->getQuery()->getResult();
    }

    public function count(array $filters = []): int
    {
        $queryBuilder = $this->entityManager->createQueryBuilder();

        $queryBuilder
            ->select('COUNT(t.id)')
            ->from(Task::class, 't');

        $this->applyFilters($queryBuilder, $filters);

        return (int) $queryBuilder->getQuery()->getSingleScalarResult();
    }

    private function applyFilters($queryBuilder, array $filters): void
    {
        if (!empty($filters['search'])) {
            $queryBuilder
                ->andWhere('t.title LIKE :search OR t.description LIKE :search')
                ->setParameter('search', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['status'])) {
            $queryBuilder
                ->andWhere('t.status = :status')
                ->setParameter('status', $filters['status']);
        }
    }

    public function find(int $id): ?Task
    {
        return $this->repository->find($id);
    }

    public function save(Task $task): void
    {
        $this->entityManager->persist($task);
        $this->entityManager->flush();
    }

    public function delete(Task $task): void
    {
        $this->entityManager->remove($task);
        $this->entityManager->flush();
    }
}
