<?php

declare(strict_types=1);

namespace App\Shared\Database;

interface SeederInterface
{
    public function run(): void;
}
