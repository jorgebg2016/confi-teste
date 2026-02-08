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
            'description' => v::optional(v::stringType()->length(1, 10000)),
        ];
    }

    protected function messages(): array
    {
        return [
            'title' => [
                'notEmpty' => 'O título não pode ser vazio',
                'stringType' => 'O título deve ser do tipo texto',
                'length' => 'O título deve ter entre 1 e 255 caracteres',
            ],
            'description' => [
                'stringType' => 'A descrição deve ser do tipo texto',
                'length' => 'A descrição deve ter no máximo 10.000 caracteres',
            ],
        ];
    }
}
