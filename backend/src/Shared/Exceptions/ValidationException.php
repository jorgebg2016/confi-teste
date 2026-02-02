<?php

declare(strict_types=1);

namespace App\Shared\Exceptions;

use Exception;

class ValidationException extends Exception
{
    public function __construct(
        private array $errors,
        string $message = 'Validation failed'
    ) {
        parent::__construct($message, 400);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
