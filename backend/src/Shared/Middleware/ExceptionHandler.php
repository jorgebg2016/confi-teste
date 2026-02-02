<?php

declare(strict_types=1);

namespace App\Shared\Middleware;

use App\Shared\Exceptions\ConflictException;
use App\Shared\Exceptions\NotFoundException;
use App\Shared\Exceptions\UnauthorizedException;
use App\Shared\Exceptions\ValidationException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;
use Slim\Exception\HttpException;
use Slim\Psr7\Response;
use Throwable;

class ExceptionHandler
{
    public function __construct(
        private bool $debug = false,
        private ?LoggerInterface $logger = null
    ) {}

    public function __invoke(
        ServerRequestInterface $request,
        Throwable $exception,
        bool $displayErrorDetails,
        bool $logErrors,
        bool $logErrorDetails
    ): ResponseInterface {
        $response = new Response();
        $statusCode = 500;
        $errorData = [
            'success' => false,
            'error' => 'Erro interno do servidor'
        ];

        if ($exception instanceof ValidationException) {
            $statusCode = 400;
            $errorData = [
                'success' => false,
                'error' => 'Falha na validação',
                'errors' => $exception->getErrors()
            ];
        } elseif ($exception instanceof NotFoundException) {
            $statusCode = 404;
            $errorData['error'] = $exception->getMessage();
        } elseif ($exception instanceof UnauthorizedException) {
            $statusCode = 401;
            $errorData['error'] = $exception->getMessage();
        } elseif ($exception instanceof ConflictException) {
            $statusCode = 409;
            $errorData['error'] = $exception->getMessage();
        } elseif ($exception instanceof HttpException) {
            $statusCode = $exception->getCode();
            $errorData['error'] = $exception->getMessage();
        }

        if ($this->debug && $statusCode === 500) {
            $errorData['error'] = $exception->getMessage();
            $errorData['trace'] = $exception->getTraceAsString();
        }

        if ($this->logger && $statusCode === 500) {
            $this->logger->error($exception->getMessage(), [
                'exception' => $exception,
                'request' => [
                    'method' => $request->getMethod(),
                    'uri' => (string) $request->getUri(),
                ]
            ]);
        }

        $response->getBody()->write(json_encode($errorData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
    }
}
