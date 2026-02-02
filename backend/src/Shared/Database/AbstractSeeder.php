<?php

declare(strict_types=1);

namespace App\Shared\Database;

use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Faker\Generator;

abstract class AbstractSeeder implements SeederInterface
{
    protected Generator $faker;

    public function __construct(
        protected EntityManagerInterface $em
    ) {
        $this->faker = Factory::create('pt_BR');
    }

    abstract public function run(): void;

    protected function truncate(string $tableName): void
    {
        $connection = $this->em->getConnection();
        $connection->executeStatement('SET FOREIGN_KEY_CHECKS = 0');
        $connection->executeStatement("TRUNCATE TABLE {$tableName}");
        $connection->executeStatement('SET FOREIGN_KEY_CHECKS = 1');
    }

    protected function count(string $entityClass): int
    {
        return (int) $this->em
            ->createQueryBuilder()
            ->select('COUNT(e)')
            ->from($entityClass, 'e')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
