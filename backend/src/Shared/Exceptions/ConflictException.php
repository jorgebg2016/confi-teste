<?php

declare(strict_types=1);

namespace App\Shared\Exceptions;

use Exception;

class ConflictException extends Exception
{
    public function __construct(string $message = 'Resource already exists')
    {
        parent::__construct($message, 409);
    }
}
