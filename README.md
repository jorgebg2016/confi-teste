# Teste Avaliativo - Confi

## Estrutura

- /backend -> PHP, SLIM, DOCTRINE
- /frontend -> REACT, TYPESCRIPT, REDUX, SHADCN/UI

## Execução

docker compose up

## 1. Backend

### Estrutura de Dados - Tarefa (JSON Schema)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Task",
  "type": "object",
  "required": ["title", "status"],
  "properties": {
    "id": {
      "type": "integer",
      "description": "ID da tarefa (auto-gerado)"
    },
    "title": {
      "type": "string",
      "maxLength": 255,
      "description": "Título da tarefa"
    },
    "description": {
      "type": ["string", "null"],
      "description": "Descrição detalhada da tarefa (opcional)"
    },
    "status": {
      "type": "string",
      "enum": ["Pendente", "Concluido"],
      "description": "Status atual da tarefa"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora de criação (auto-gerado)"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora da última atualização (auto-gerado)"
    }
  }
}
```

### Exemplo de Objeto

```json
{
  "id": 1,
  "title": "Implementar autenticação",
  "description": "Adicionar sistema de login com JWT",
  "status": "Pendente",
  "created_at": "2026-02-01 10:30:00",
  "updated_at": "2026-02-01 10:30:00"
}
```

## 2. Frontend

### Estrutura de Componentes

```
frontend/src/
├── App.tsx                        # Componente raiz da aplicação
├── main.tsx                       # Ponto de entrada, configura Provider Redux
│
├── components/
│   ├── layout/
│   │   ├── Container.tsx          # Container responsivo para centralizar conteúdo
│   │   └── Header.tsx             # Cabeçalho da aplicação com título e ações
│   │
│   ├── task/
│   │   ├── TaskList.tsx           # Lista de tarefas com loading e empty state
│   │   ├── TaskCard.tsx           # Card individual de tarefa com ações
│   │   ├── TaskForm.tsx           # Formulário de criação/edição de tarefa
│   │   ├── TaskModal.tsx          # Modal que encapsula o TaskForm
│   │   ├── TaskStatusBadge.tsx    # Badge visual do status (Pendente/Concluído)
│   │   └── DeleteConfirmDialog.tsx # Diálogo de confirmação para exclusão
│   │
│   └── ui/                        # Componentes base do shadcn/ui
│       ├── alert.tsx              # Componente de alerta
│       ├── alert-dialog.tsx       # Diálogo de confirmação
│       ├── badge.tsx              # Badge/etiqueta
│       ├── button.tsx             # Botão com variantes
│       ├── card.tsx               # Card container
│       ├── dialog.tsx             # Modal/diálogo
│       ├── input.tsx              # Campo de entrada
│       └── textarea.tsx           # Campo de texto multilinha
│
├── store/
│   ├── index.ts                   # Configuração do Redux store
│   ├── hooks.ts                   # Hooks tipados (useAppDispatch, useAppSelector)
│   └── slices/
│       ├── taskSlice.ts           # Estado e actions das tarefas (async thunks)
│       └── uiSlice.ts             # Estado da UI (modais, loading)
│
├── services/
│   ├── api.ts                     # Configuração base do Axios
│   └── taskService.ts             # Serviço de API para tarefas (CRUD)
│
├── types/
│   ├── task.ts                    # Tipos TypeScript para Task
│   └── api.ts                     # Tipos para respostas da API
│
└── lib/
    └── utils.ts                   # Utilitários (cn para classes CSS)
```

## 3. Estrutura Docker

### Arquitetura de Portas

```
  confi_network (driver bridge)

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │   frontend  │  │   backend   │  │    mysql    │
  │  :5174→5173 │->│  :8088→8000 │->│  :3307→3306 │
  │   (Vite)    │  │  (PHP CLI)  │  │  (MySQL 8)  │
  └─────────────┘  └─────────────┘  └─────────────┘
```

### Decisões de Configuração

**Imagem MySQL** -> `mysql:8.0` Versão estável com suporte a JSON, CTEs e window functions
**Imagem PHP** -> `php:8.2-cli` Versão leve sem Apache, ideal para desenvolvimento
**Imagem Node** -> `node:20-alpine` Alpine reduz tamanho da imagem, Node 20 é LTS
**Portas externas** -> 3307, 8088, 5174 Evita conflitos com serviços locais que gerelmente rodam nas portas 3306, 8080 e 5173
**Healthcheck MySQL** -> `mysqladmin ping` Garante que backend só inicia após MySQL estar pronto

### Estratégia de Volumes

`./backend:/var/www/html` -> Bind mount: Hot-reload do código PHP
`./frontend:/app` -> Bind mount: Hot-reload com Vite HMR
`mysql_data` -> Volume nomeado: Persistência dos dados do banco
`backend_vendor` -> Volume nomeado: Performance (evita sync de vendor)
`frontend_node_modules` -> Volume nomeado: Performance (evita sync de node_modules)

**Razões para o uso de volumes nomeados para dependências**

- Bind mounts sincronizam milhares de arquivos entre host e container
- Volumes nomeados ficam apenas no Docker, melhorando I/O
- Dependências são instaladas no build, não precisam de sync

### Variáveis de Ambiente - Backend

- APP_ENV=development # Modo de desenvolvimento
- APP_DEBUG=true # Habilita debug detalhado
- DB_DRIVER=pdo_mysql
- DB_HOST=127.0.0.1
- DB_PORT=3306
- DB_NAME=confi_teste_db
- DB_USER=root
- DB_PASSWORD=your_password_here
- DB_CHARSET=utf8mb4 # Suporte completo a Unicode/emojis

### Hot-Reload

**Frontend** -> Vite HMR: Alterações refletem instantaneamente sem refresh
**Backend** -> PHP interpretado: Alterações refletem na próxima requisição

### Tempo total de desenvolvimento

- 15 horas
