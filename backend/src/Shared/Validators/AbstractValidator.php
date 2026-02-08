<?php

declare(strict_types=1);

namespace App\Shared\Validators;

use App\Shared\Exceptions\ValidationException;
use Respect\Validation\Exceptions\NestedValidationException;

abstract class AbstractValidator
{
    protected array $errors = [];

    abstract protected function rules(): array;

    protected function messages(): array
    {
        return [];
    }

    public function validate(array $data): array
    {
        $this->errors = [];
        $rules = $this->rules();

        foreach ($rules as $field => $rule) {
            $value = $data[$field] ?? null;

            try {
                $rule->setName($field)->assert($value);
            } catch (NestedValidationException $e) {
                $fieldMessages = $this->messages()[$field] ?? [];
                if (!empty($fieldMessages)) {
                    $this->errors[$field] = $this->findTranslatedMessage($e, $fieldMessages) ?? 'Valor inválido';
                } else {
                    $this->errors[$field] = $e->getMessages()[$field] ?? $e->getMessages()[0] ?? 'Valor inválido';
                }
            }
        }

        if (!empty($this->errors)) {
            throw new ValidationException($this->errors);
        }

        return $data;
    }

    private function findTranslatedMessage(NestedValidationException $e, array $messages): ?string
    {
        foreach ($e->getChildren() as $child) {
            $className = (new \ReflectionClass($child))->getShortName();
            $ruleKey = lcfirst(str_replace('Exception', '', $className));
            if (isset($messages[$ruleKey])) {
                return $messages[$ruleKey];
            }
            if ($child instanceof NestedValidationException) {
                $found = $this->findTranslatedMessage($child, $messages);
                if ($found !== null) {
                    return $found;
                }
            }
        }
        return null;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
