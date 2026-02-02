<?php

declare(strict_types=1);

namespace App\Feature\Task\Tests;

use Tests\TestCase;

class TaskEndpointTest extends TestCase
{
    public function testListarTarefas(): void
    {
        $response = $this->get('/api/tasks');

        $this->assertResponseOk($response);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
        $this->assertArrayHasKey('data', $json);
        $this->assertArrayHasKey('pagination', $json);
    }

    public function testCriarTarefa(): void
    {
        $response = $this->post('/api/tasks', [
            'title' => 'Tarefa de Teste',
            'description' => 'Descrição de Teste',
        ]);

        $this->assertResponseStatus($response, 201);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
        $this->assertEquals('Tarefa de Teste', $json['data']['title']);
        $this->assertEquals('Descrição de Teste', $json['data']['description']);
        $this->assertEquals('Pendente', $json['data']['status']);
    }

    public function testCriarTarefaValidacao(): void
    {
        $response = $this->post('/api/tasks', []);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertArrayHasKey('errors', $json);
    }

    public function testExibirTarefa(): void
    {
        $createResponse = $this->post('/api/tasks', [
            'title' => 'Tarefa para Exibir',
        ]);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->get("/api/tasks/{$taskId}");

        $this->assertResponseOk($response);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
        $this->assertEquals($taskId, $json['data']['id']);
        $this->assertEquals('Tarefa para Exibir', $json['data']['title']);
    }

    public function testExibirTarefaNaoEncontrada(): void
    {
        $response = $this->get('/api/tasks/999999');

        $this->assertResponseStatus($response, 404);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
    }

    public function testAtualizarTarefa(): void
    {
        $createResponse = $this->post('/api/tasks', [
            'title' => 'Título Original',
        ]);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->put("/api/tasks/{$taskId}", [
            'title' => 'Título Atualizado',
            'description' => 'Descrição Atualizada',
        ]);

        $this->assertResponseOk($response);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
        $this->assertEquals('Título Atualizado', $json['data']['title']);
        $this->assertEquals('Descrição Atualizada', $json['data']['description']);
    }

    public function testAlternarStatusTarefa(): void
    {
        $createResponse = $this->post('/api/tasks', [
            'title' => 'Tarefa para Alternar',
        ]);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $this->assertEquals('Pendente', $created['data']['status']);

        $response = $this->patch("/api/tasks/{$taskId}/status");

        $this->assertResponseOk($response);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
        $this->assertEquals('Concluido', $json['data']['status']);
    }

    public function testExcluirTarefa(): void
    {
        $createResponse = $this->post('/api/tasks', [
            'title' => 'Tarefa para Excluir',
        ]);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->delete("/api/tasks/{$taskId}");

        $this->assertResponseOk($response);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);

        $showResponse = $this->get("/api/tasks/{$taskId}");
        $this->assertResponseStatus($showResponse, 404);
    }
}
