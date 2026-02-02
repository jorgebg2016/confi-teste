<?php

declare(strict_types=1);

namespace App\Shared\Validators;

use App\Shared\Exceptions\ValidationException;
use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

abstract class AbstractValidator
{
    protected array $errors = [];

    abstract protected function rules(): array;

    public function validate(array $data): array
    {
        $this->errors = [];
        $rules = $this->rules();

        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? null;

            try {
                $rule->setName($field)->assert($value);
            } catch (NestedValidationException $e) {
                $this->errors[$field] = $e->getMessages()[$field] ?? $e->getMessages()[0] ?? 'Invalid value';
            }
        }

        if (!empty($this->errors)) {
            throw new ValidationException($this->errors);
        }

        return $data;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
