<?php

declare(strict_types=1);

namespace App\Feature\Task\Validators;

use App\Shared\Validators\AbstractValidator;
use Respect\Validation\Validator as v;

class CreateTaskValidator extends AbstractValidator
{
    protected function rules(): array
    {
        return [
            'title' => v::notEmpty()->stringType()->length(1, 255),
        ];
    }
}
