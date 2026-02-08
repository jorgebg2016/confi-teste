<?php

declare(strict_types=1);

namespace App\Shared\Exceptions;

use Exception;

class UnauthorizedException extends Exception
{
    public function __construct(string $message = 'Não autorizado')
    {
        parent::__construct($message, 401);
    }
}
