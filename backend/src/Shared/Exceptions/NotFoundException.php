<?php

declare(strict_types=1);

namespace App\Shared\Exceptions;

use Exception;

class NotFoundException extends Exception
{
    public function __construct(string $message = 'Recurso não encontrado')
    {
        parent::__construct($message, 404);
    }
}
