<?php

declare(strict_types=1);

namespace App\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260126000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create tasks table';
    }

    public function up(Schema $schema): void
    {
        $table = $schema->createTable('tasks');

        $table->addColumn('id', 'integer', [
            'autoincrement' => true,
            'unsigned' => true,
        ]);
        $table->addColumn('title', 'string', ['length' => 255]);
        $table->addColumn('description', 'text', ['notnull' => false]);
        $table->addColumn('status', 'string', ['length' => 20, 'default' => 'Pendente']);
        $table->addColumn('created_at', 'datetime_immutable');
        $table->addColumn('updated_at', 'datetime_immutable');

        $table->setPrimaryKey(['id']);
        $table->addIndex(['status'], 'idx_tasks_status');
        $table->addIndex(['created_at'], 'idx_tasks_created_at');
    }

    public function down(Schema $schema): void
    {
        $schema->dropTable('tasks');
    }
}
