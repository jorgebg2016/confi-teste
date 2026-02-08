<?php

declare(strict_types=1);

namespace App\Feature\Task\Tests;

use Tests\TestCase;

class TaskValidacaoTest extends TestCase
{
    public function testCriarTarefaSemTituloRetorna400(): void
    {
        $response = $this->post('/api/tasks', []);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('Falha na validação', $json['error']);
        $this->assertArrayHasKey('errors', $json);
        $this->assertArrayHasKey('title', $json['errors']);
    }

    public function testCriarTarefaComTituloVazioRetornaMensagemEmPortugues(): void
    {
        $response = $this->post('/api/tasks', ['title' => '']);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('O título não pode ser vazio', $json['errors']['title']);
    }

    public function testCriarTarefaComTituloNullRetornaMensagemEmPortugues(): void
    {
        $response = $this->post('/api/tasks', ['title' => null]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('O título não pode ser vazio', $json['errors']['title']);
    }

    public function testCriarTarefaComTituloLongoRetornaMensagemEmPortugues(): void
    {
        $response = $this->post('/api/tasks', ['title' => str_repeat('a', 256)]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('O título deve ter entre 1 e 255 caracteres', $json['errors']['title']);
    }

    public function testCriarTarefaComTituloTipoErradoRetornaMensagemEmPortugues(): void
    {
        $response = $this->post('/api/tasks', ['title' => 123]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('O título deve ser do tipo texto', $json['errors']['title']);
    }

    public function testCriarTarefaComDescricaoLongaRetornaMensagemEmPortugues(): void
    {
        $response = $this->post('/api/tasks', [
            'title' => 'Tarefa válida',
            'description' => str_repeat('a', 10001),
        ]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('A descrição deve ter no máximo 10.000 caracteres', $json['errors']['description']);
    }

    public function testCriarTarefaComDescricaoTipoErradoRetornaMensagemEmPortugues(): void
    {
        $response = $this->post('/api/tasks', [
            'title' => 'Tarefa válida',
            'description' => 123,
        ]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('A descrição deve ser do tipo texto', $json['errors']['description']);
    }

    public function testCriarTarefaComDescricaoValidaPassaNaValidacao(): void
    {
        $response = $this->post('/api/tasks', [
            'title' => 'Tarefa válida',
            'description' => str_repeat('a', 10000),
        ]);

        $this->assertResponseStatus($response, 201);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
    }

    public function testCriarTarefaSemDescricaoPassaNaValidacao(): void
    {
        $response = $this->post('/api/tasks', [
            'title' => 'Tarefa sem descrição',
        ]);

        $this->assertResponseStatus($response, 201);

        $json = $this->getJson($response);

        $this->assertTrue($json['success']);
    }

    public function testAtualizarTarefaComTituloLongoRetornaMensagemEmPortugues(): void
    {
        $createResponse = $this->post('/api/tasks', ['title' => 'Tarefa Original']);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->put("/api/tasks/{$taskId}", ['title' => str_repeat('b', 256)]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('O título deve ter entre 1 e 255 caracteres', $json['errors']['title']);
    }

    public function testAtualizarTarefaComTituloTipoErradoRetornaMensagemEmPortugues(): void
    {
        $createResponse = $this->post('/api/tasks', ['title' => 'Tarefa Original']);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->put("/api/tasks/{$taskId}", ['title' => 456]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('O título deve ser do tipo texto', $json['errors']['title']);
    }

    public function testAtualizarTarefaComDescricaoLongaRetornaMensagemEmPortugues(): void
    {
        $createResponse = $this->post('/api/tasks', ['title' => 'Tarefa Original']);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->put("/api/tasks/{$taskId}", [
            'description' => str_repeat('b', 10001),
        ]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('A descrição deve ter no máximo 10.000 caracteres', $json['errors']['description']);
    }

    public function testAtualizarTarefaComDescricaoTipoErradoRetornaMensagemEmPortugues(): void
    {
        $createResponse = $this->post('/api/tasks', ['title' => 'Tarefa Original']);
        $created = $this->getJson($createResponse);
        $taskId = $created['data']['id'];

        $response = $this->put("/api/tasks/{$taskId}", [
            'description' => 789,
        ]);

        $this->assertResponseStatus($response, 400);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('A descrição deve ser do tipo texto', $json['errors']['description']);
    }

    public function testExibirTarefaInexistenteRetornaMensagemEmPortugues(): void
    {
        $response = $this->get('/api/tasks/999999');

        $this->assertResponseStatus($response, 404);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('Tarefa não encontrada', $json['error']);
    }

    public function testAtualizarTarefaInexistenteRetornaMensagemEmPortugues(): void
    {
        $response = $this->put('/api/tasks/999999', ['title' => 'Novo Título']);

        $this->assertResponseStatus($response, 404);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('Tarefa não encontrada', $json['error']);
    }

    public function testExcluirTarefaInexistenteRetornaMensagemEmPortugues(): void
    {
        $response = $this->delete('/api/tasks/999999');

        $this->assertResponseStatus($response, 404);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('Tarefa não encontrada', $json['error']);
    }

    public function testAlternarStatusTarefaInexistenteRetornaMensagemEmPortugues(): void
    {
        $response = $this->patch('/api/tasks/999999/status');

        $this->assertResponseStatus($response, 404);

        $json = $this->getJson($response);

        $this->assertFalse($json['success']);
        $this->assertEquals('Tarefa não encontrada', $json['error']);
    }

    public function testRespostaDeValidacaoTemEstruturaCorreta(): void
    {
        $response = $this->post('/api/tasks', []);

        $json = $this->getJson($response);

        $this->assertArrayHasKey('success', $json);
        $this->assertArrayHasKey('error', $json);
        $this->assertArrayHasKey('errors', $json);
        $this->assertFalse($json['success']);
        $this->assertIsString($json['error']);
        $this->assertIsArray($json['errors']);
    }

    public function testRespostaDeNotFoundTemEstruturaCorreta(): void
    {
        $response = $this->get('/api/tasks/999999');

        $json = $this->getJson($response);

        $this->assertArrayHasKey('success', $json);
        $this->assertArrayHasKey('error', $json);
        $this->assertFalse($json['success']);
        $this->assertIsString($json['error']);
    }
}
