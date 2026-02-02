<?php

declare(strict_types=1);

namespace Tests;

use DI\ContainerBuilder;
use PHPUnit\Framework\TestCase as PHPUnitTestCase;
use Psr\Http\Message\ResponseInterface;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;

abstract class TestCase extends PHPUnitTestCase
{
    protected App $app;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = $this->createApp();
    }

    protected function createApp(): App
    {
        $settings = require __DIR__ . '/../config/settings.php';

        $containerBuilder = new ContainerBuilder();
        $dependencies = require __DIR__ . '/../config/dependencies.php';
        $dependencies($containerBuilder, $settings);

        $container = $containerBuilder->build();

        AppFactory::setContainer($container);
        $app = AppFactory::create();

        $middleware = require __DIR__ . '/../config/middleware.php';
        $middleware($app);

        $routes = require __DIR__ . '/../config/routes.php';
        $routes($app);

        return $app;
    }

    protected function get(string $uri, array $headers = []): ResponseInterface
    {
        return $this->request('GET', $uri, [], $headers);
    }

    protected function post(string $uri, array $data = [], array $headers = []): ResponseInterface
    {
        return $this->request('POST', $uri, $data, $headers);
    }

    protected function put(string $uri, array $data = [], array $headers = []): ResponseInterface
    {
        return $this->request('PUT', $uri, $data, $headers);
    }

    protected function patch(string $uri, array $data = [], array $headers = []): ResponseInterface
    {
        return $this->request('PATCH', $uri, $data, $headers);
    }

    protected function delete(string $uri, array $headers = []): ResponseInterface
    {
        return $this->request('DELETE', $uri, [], $headers);
    }

    protected function request(string $method, string $uri, array $data = [], array $headers = []): ResponseInterface
    {
        $factory = new ServerRequestFactory();
        $request = $factory->createServerRequest($method, $uri);

        foreach ($headers as $name => $value) {
            $request = $request->withHeader($name, $value);
        }

        if (!empty($data)) {
            $request = $request->withHeader('Content-Type', 'application/json');
            $request = $request->withParsedBody($data);
        }

        return $this->app->handle($request);
    }

    protected function getJson(ResponseInterface $response): array
    {
        $body = (string) $response->getBody();
        return json_decode($body, true) ?? [];
    }

    protected function assertResponseOk(ResponseInterface $response): void
    {
        $this->assertContains($response->getStatusCode(), [200, 201]);
    }

    protected function assertResponseStatus(ResponseInterface $response, int $status): void
    {
        $this->assertEquals($status, $response->getStatusCode());
    }
}
