# 🐰 Comunicação entre Aplicações com RabbitMQ e NestJS

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📑 Índice

- [📋 Sobre o Projeto](#-sobre-o-projeto)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [📦 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔧 Pré-requisitos](#-pré-requisitos)
- [⚙️ Instalação e Configuração](#️-instalação-e-configuração)
- [🎮 Como Usar](#-como-usar)
- [📝 Detalhes de Implementação](#-detalhes-de-implementação)
- [🐳 Docker](#-docker)
- [🧪 Testes](#-testes)
- [📚 Conceitos Demonstrados](#-conceitos-demonstrados)
- [🔍 Monitoramento](#-monitoramento)
- [🛠️ Scripts Disponíveis](#️-scripts-disponíveis)
- [🔧 Troubleshooting](#-troubleshooting)
- [📖 Recursos de Aprendizado](#-recursos-de-aprendizado)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)
- [👨‍💻 Autor](#-autor)

---

## 📋 Sobre o Projeto

Este projeto é um exemplo prático de comunicação assíncrona entre aplicações usando **RabbitMQ** como message broker e **NestJS** como framework. Foi desenvolvido como material de apoio para um tutorial em vídeo no YouTube, demonstrando dois padrões principais de mensageria e implementação de retry automático:

- **Queue (Fila Direta)**: Envio de mensagens diretamente para filas específicas
- **Exchange (Publicador/Assinante)**: Distribuição de mensagens através de exchanges com routing keys
- **Dead Letter Queue (DLQ)**: Sistema de retry automático com Dead Letter Exchange
- **Shared Library**: Biblioteca compartilhada para reutilização de código entre aplicações

### 🎯 Objetivo

Demonstrar de forma clara e prática como implementar comunicação assíncrona entre microserviços utilizando RabbitMQ, incluindo:

- Publicação de mensagens em filas
- Publicação de mensagens em exchanges
- Consumo de mensagens de múltiplas filas
- Sistema de retry automático com Dead Letter Queues
- Tratamento robusto de erros e falhas
- Configuração de ambiente com Docker
- Arquitetura de monorepo com bibliotecas compartilhadas

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura de **monorepo NestJS** composta por duas aplicações independentes e uma biblioteca compartilhada:

### 1. **API** (`apps/api`)

Aplicação REST que expõe endpoints para publicar mensagens no RabbitMQ.

**Endpoints:**

- `GET /default-nest` - Endpoint de teste básico
- `GET /queue` - Publica mensagem diretamente na fila `email`
- `GET /exchange` - Publica mensagem no exchange `amq.direct` com routing key `process`

**Porta:** `3333`

### 2. **Process** (`apps/process`)

Aplicação consumidora que processa mensagens das filas do RabbitMQ em background.

**Consumidores:**

- **EmailService**: Consome mensagens da fila `email`
- **NotificationService**: Consome mensagens da fila `notifications`

**Características:**

- Inicialização automática dos consumidores via `OnModuleInit`
- Sistema de retry automático com Dead Letter Queue
- Máximo de 2 tentativas antes de descartar mensagem
- TTL de 5 segundos para retry

### 3. **RabbitMQ Library** (`libs/rabbitmq`)

Biblioteca compartilhada que encapsula toda a lógica de integração com RabbitMQ.

**Funcionalidades:**

- Gerenciamento de conexão e canais
- Publicação em filas e exchanges
- Consumo de mensagens com callback
- Sistema de retry com Dead Letter Exchange
- Acknowledgment (ACK/NACK) automático
- Lifecycle hooks (OnModuleInit, OnModuleDestroy)

### 📊 Fluxo de Dados

#### Fluxo Normal (Queue)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   API       │────────▶│  RabbitMQ    │────────▶│  Process        │
│             │         │              │         │                 │
│ GET /queue  │────────▶│ Queue: email │────────▶│  EmailService   │
│             │         │              │         │                 │
└─────────────┘         └──────────────┘         └─────────────────┘
```

#### Fluxo com Exchange

```
┌─────────────┐         ┌──────────────────────┐         ┌─────────────────┐
│   API       │────────▶│  RabbitMQ            │────────▶│  Process        │
│             │         │                      │         │                 │
│GET /exchange│────────▶│ Exchange: amq.direct │────────▶│ NotificationSvc │
│             │         │ Routing: process     │    ┌───▶│ EmailService    │
└─────────────┘         └──────────────────────┘    │    └─────────────────┘
                                  │                  │
                                  └──────────────────┘
```

#### Fluxo de Retry (Dead Letter Queue)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Main Queue  │────▶│ Consumer     │────▶│ Error?          │
│  (email)    │     │ (Processing) │     │                 │
└─────────────┘     └──────────────┘     └────────┬────────┘
      ▲                                           │
      │                                           │ NACK
      │                                           ▼
      │                              ┌─────────────────────┐
      │                              │ DLX: retry.email    │
      │                              └──────────┬──────────┘
      │                                         │
      │                                         ▼
      │                              ┌─────────────────────┐
      │                              │ Retry Queue         │
      │                              │ TTL: 5s, Max: 2     │
      └──────────────────────────────┴─────────────────────┘
```

## 🚀 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** v10 - Framework Node.js progressivo
- **[RabbitMQ](https://www.rabbitmq.com/)** 3.8 - Message Broker AMQP
- **[TypeScript](https://www.typescriptlang.org/)** 5.1 - Superset JavaScript tipado
- **[Docker](https://www.docker.com/)** & **Docker Compose** - Containerização e orquestração
- **[PostgreSQL](https://www.postgresql.org/)** 16 - Banco de dados relacional (preparado para uso futuro)
- **[amqplib](https://www.npmjs.com/package/amqplib)** 0.10 - Client AMQP 0-9-1 para Node.js
- **[amqp-connection-manager](https://www.npmjs.com/package/amqp-connection-manager)** 4.1 - Gerenciamento automático de reconexão

### Dependências Principais

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/config": "^3.2.2", // Gerenciamento de configuração
  "@nestjs/core": "^10.0.0",
  "@nestjs/microservices": "^10.3.9", // Suporte a microserviços
  "@nestjs/platform-express": "^10.0.0",
  "amqp-connection-manager": "^4.1.14",
  "amqplib": "^0.10.4",
  "reflect-metadata": "^0.2.0",
  "rxjs": "^7.8.1"
}
```

## ⚙️ Variáveis de Ambiente

O projeto usa o módulo `@nestjs/config` para gerenciar variáveis de ambiente.

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto (use `.env.example` como base):

```env
# Conexão RabbitMQ
RABBITMQ_URI=amqp://admin:admin@rabbitmq:5672

# Para desenvolvimento local (sem Docker)
# RABBITMQ_URI=amqp://admin:admin@localhost:5672
```

### Configuração no Código

```typescript
// apps/api/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carrega .env globalmente
    RabbitmqModule,
  ],
  // ...
})
```

```typescript
// libs/rabbitmq/src/rabbitmq.provider.ts
export const RabbitMQProvider = {
  provide: 'RABBITMQ_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('RABBITMQ_URI'); // Lê do .env
    return () => connect(uri);
  },
  inject: [ConfigService],
};
```

### Variáveis Disponíveis

| Variável       | Descrição               | Valor Padrão (Docker)              | Valor Local                         |
| -------------- | ----------------------- | ---------------------------------- | ----------------------------------- |
| `RABBITMQ_URI` | URI de conexão RabbitMQ | `amqp://admin:admin@rabbitmq:5672` | `amqp://admin:admin@localhost:5672` |

> **Nota:** No Docker, use o nome do serviço (`rabbitmq`) como hostname. Localmente, use `localhost`.

## 📦 Estrutura do Projeto

```
.
├── apps/                         # Aplicações do monorepo
│   ├── api/                      # Aplicação produtora de mensagens
│   │   ├── src/
│   │   │   ├── app.controller.ts # Endpoints REST
│   │   │   ├── app.module.ts     # Módulo raiz da API
│   │   │   ├── app.service.ts    # Lógica de publicação
│   │   │   ├── http.http         # Exemplos de requisições HTTP
│   │   │   └── main.ts           # Bootstrap da aplicação
│   │   ├── test/
│   │   │   ├── app.e2e-spec.ts   # Testes E2E
│   │   │   └── jest-e2e.json     # Configuração Jest E2E
│   │   └── tsconfig.app.json     # TypeScript config da API
│   │
│   └── process/                  # Aplicação consumidora de mensagens
│       ├── src/
│       │   ├── email.service.ts       # Consumidor da fila 'email'
│       │   ├── notification.service.ts # Consumidor da fila 'notifications'
│       │   ├── process.module.ts      # Módulo raiz do processo
│       │   ├── process.service.ts     # Serviço do processo
│       │   └── main.ts                # Bootstrap da aplicação
│       ├── test/
│       │   ├── app.e2e-spec.ts        # Testes E2E
│       │   └── jest-e2e.json          # Configuração Jest E2E
│       └── tsconfig.app.json          # TypeScript config do processo
│
├── libs/                         # Bibliotecas compartilhadas
│   └── rabbitmq/                 # Biblioteca RabbitMQ
│       ├── src/
│       │   ├── index.ts                # Exports da biblioteca
│       │   ├── rabbitmq.module.ts      # Módulo RabbitMQ
│       │   ├── rabbitmq.provider.ts    # Provider de conexão
│       │   └── rabbitmq.service.ts     # Serviço principal
│       └── tsconfig.lib.json           # TypeScript config da lib
│
├── docker-compose.yml            # Orquestração de containers
├── Dockerfile                    # Imagem Docker da aplicação
├── .env.example                  # Exemplo de variáveis de ambiente
├── nest-cli.json                 # Configuração do NestJS CLI (monorepo)
├── package.json                  # Dependências do projeto
├── tsconfig.json                 # Configuração TypeScript global
├── tsconfig.build.json           # Configuração build TypeScript
├── jest-e2e.json                 # Configuração Jest global
└── README.md                     # Este arquivo
```

## 🔧 Pré-requisitos

- **Node.js** >= 18
- **Docker** >= 20.10
- **Docker Compose** >= 2.0

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd nest
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Arquivo `.env`:

```env
RABBITMQ_URI=amqp://admin:admin@rabbitmq:5672
```

> **Nota:** Para desenvolvimento local fora do Docker, altere para `amqp://admin:admin@localhost:5672`

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie os containers Docker

```bash
docker-compose up -d
```

Isso irá iniciar:

- **API** na porta `3333` (container: `nest_msg_api`)
- **PostgreSQL** na porta `5432` (container: `nest_msg_postgres`)
- **RabbitMQ** nas portas `5672` (AMQP) e `15672` (Management UI) (container: `nest_msg_rabbitmq`)

### 5. Acesse o RabbitMQ Management

Abra o navegador em: `http://localhost:15672`

**Credenciais:**

- **Usuário:** `admin`
- **Senha:** `admin`

## 🎮 Como Usar

### Executando a API

#### Modo Desenvolvimento

```bash
# Executar apenas a API
npm run start:dev api

# Ou usando o nest CLI diretamente
npx nest start api --watch
```

#### Modo Produção

```bash
# Build
npm run build

# Executar
npm run start:prod:api
```

A API estará disponível em `http://localhost:3333`

### Executando o Consumidor (Process)

#### Modo Desenvolvimento

```bash
# Em outro terminal
npm run start:dev process

# Ou usando o nest CLI diretamente
npx nest start process --watch
```

#### Modo Produção

```bash
# Build (se ainda não fez)
npm run build

# Executar
npm run start:prod:process
```

Os consumidores iniciarão automaticamente e exibirão no console as mensagens recebidas.

### Testando os Endpoints

#### 1. Publicar na fila direta (Queue)

```bash
curl http://localhost:3333/queue
```

Este endpoint:

- Publica uma mensagem JSON na fila `email`: `{ "message": "Email enviado para queue" }`
- A mensagem será consumida pelo `EmailService` no `process`
- Em caso de erro, a mensagem será retentada até 2 vezes com delay de 5 segundos

#### 2. Publicar via Exchange

```bash
curl http://localhost:3333/exchange
```

Este endpoint:

- Publica uma mensagem JSON no exchange `amq.direct` com routing key `process`
- Mensagem: `{ "message": "Enviando informações para exchange (email and notifications)" }`
- A mensagem será distribuída para as filas vinculadas ao exchange
- Será consumida pelos serviços `EmailService` e `NotificationService`

#### 3. Usando arquivo HTTP (apps/api/src/http.http)

Se você usar a extensão REST Client no VS Code, pode executar as requisições diretamente do arquivo `http.http`.

### Observando o Comportamento

**Logs do Process:**

```bash
# Visualizar logs em tempo real
docker logs -f nest_msg_api

# Para o container do processo (se executado no Docker)
docker logs -f <container_id_process>
```

**RabbitMQ Management UI:**

- Acesse `http://localhost:15672`
- Navegue até "Queues" para ver as filas `email`, `notifications`, `retry.email`, `retry.notifications`
- Observe as taxas de mensagens, confirmações e retries

## 📝 Detalhes de Implementação

### RabbitMQ Service (`libs/rabbitmq/src/rabbitmq.service.ts`)

O serviço RabbitMQ é uma biblioteca compartilhada que fornece métodos para interagir com o RabbitMQ:

#### Métodos Principais

```typescript
// Publicar em uma fila específica
publishInQueue(queue: 'email' | 'notifications', message: string): Promise<boolean>

// Publicar em um exchange com routing key
publishInExchange(
  exchange: 'amq.direct',
  routingKey: 'process',
  message: string
): Promise<boolean>

// Criar filas com Dead Letter Exchange configurado
createAssert(queue: 'email' | 'notifications'): Promise<void>

// Consumir mensagens de uma fila com callback
consume(
  queue: 'email' | 'notifications',
  callback: (message: Message) => Promise<void>,
  options?: { maxRetries?: number }
): Promise<void>
```

#### Sistema de Retry com Dead Letter Queue

A implementação do `createAssert` configura automaticamente:

1. **Fila Principal** (`email` ou `notifications`)

   - Configurada com Dead Letter Exchange
   - Ao receber NACK, mensagem é enviada para retry exchange

2. **Dead Letter Exchange** (`retry.email` ou `retry.notifications`)

   - Tipo: `direct`
   - Roteia mensagens falhadas para a fila de retry

3. **Fila de Retry** (`retry.email` ou `retry.notifications`)
   - TTL: 5000ms (5 segundos)
   - Após expirar, mensagem retorna para fila principal
   - Máximo de 2 tentativas (configurável via options)

**Configuração da Fila Principal:**

```typescript
await this.channel.assertQueue(queue, {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': retryExchange,
    'x-dead-letter-routing-key': queue,
  },
});
```

**Configuração da Fila de Retry:**

```typescript
await this.channel.assertQueue(retryQueue, {
  durable: true,
  arguments: {
    'x-message-ttl': 5000,
    'x-dead-letter-exchange': '',
    'x-dead-letter-routing-key': queue,
  },
});
```

#### Lógica de Consumo com Retry

```typescript
private async onConsume(
  message: ConsumeMessage,
  onMessage: (msg: ConsumeMessage | null) => Promise<void>,
  options: any,
) {
  const maxRetries = options?.maxRetries || 2;
  const xDeath = message?.properties?.headers?.['x-death'];
  const retryCount = xDeath ? xDeath[0].count : 0;

  try {
    if (onMessage) {
      await onMessage(message);
    }
    this.channel.ack(message); // Sucesso
    return;
  } catch (_error) {
    if (retryCount > maxRetries) {
      this.channel.ack(message); // Descarta após max retries
      return;
    }
    this.channel.nack(message, false, false); // Reenvia para DLQ
  }
}
```

### RabbitMQ Provider (`libs/rabbitmq/src/rabbitmq.provider.ts`)

Provider customizado que gerencia a conexão com RabbitMQ:

```typescript
export const RabbitMQProvider = {
  provide: 'RABBITMQ_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('RABBITMQ_URI');
    return () => connect(uri);
  },
  inject: [ConfigService],
};
```

**Características:**

- Utiliza `ConfigService` do NestJS para variáveis de ambiente
- Retorna uma factory function para lazy connection
- URI configurável via arquivo `.env`

### RabbitMQ Module (`libs/rabbitmq/src/rabbitmq.module.ts`)

Módulo compartilhado que exporta o serviço:

```typescript
@Module({
  providers: [RabbitmqService, RabbitMQProvider],
  exports: [RabbitmqService, RabbitMQProvider.provide],
})
export class RabbitmqModule {}
```

### Consumidores Automáticos

Os serviços de consumo implementam `OnModuleInit` para iniciar automaticamente:

#### EmailService

```typescript
async onModuleInit() {
  await this.rabbitmqService.createAssert('email');
  await this.rabbitmqService.consume('email', async (message) => {
    console.log(message.content.toString());

    throw new Error('test error'); // Simulação de erro para testar retry

    // Aqui: salvar no banco de dados, enviar email, etc.
  });
}
```

#### NotificationService

```typescript
async onModuleInit() {
  await this.rabbitmqService.createAssert('notifications');
  await this.rabbitmqService.consume('notifications', async (message) => {
    console.log(message.content.toString());

    // Processar notificação
  });
}
```

### Lifecycle Hooks

O `RabbitmqService` implementa hooks de ciclo de vida para gerenciar recursos:

```typescript
async onModuleInit() {
  if (!this.connection) {
    this.connection = await this.rabbitMQProvider();
  }
  if (!this.channel) {
    this.channel = await this.connection.createChannel();
  }
}

async onModuleDestroy() {
  if (!!this.channel) await this.channel.close();
  if (!!this.connection) await this.connection.close();
}
```

## 🐳 Docker

### Serviços Configurados

O `docker-compose.yml` orquestra três serviços:

#### 1. **API** (nest_msg_api)

- **Imagem**: Build do Dockerfile local
- **Porta**: `3333:3333`
- **Volume**: `.:/home/node/nest` (hot reload)
- **Depende de**: PostgreSQL e RabbitMQ
- **Network**: `nest_msg_network`

#### 2. **PostgreSQL** (nest_msg_postgres)

- **Imagem**: `postgres:16`
- **Porta**: `5432:5432`
- **Volume**: `postgres` (persistência de dados)
- **Credenciais**:
  - User: `admin`
  - Password: `admin`
- **Recursos Limitados**:
  - CPU: 0.5 cores
  - Memory: 128MB

#### 3. **RabbitMQ** (nest_msg_rabbitmq)

- **Imagem**: `rabbitmq:3.8-management-alpine`
- **Portas**:
  - `5672`: AMQP protocol
  - `15672`: Management UI
- **Volume**: `rabbitmq` (persistência de mensagens)
- **Credenciais**:
  - User: `admin`
  - Password: `admin`
- **Recursos Limitados**:
  - CPU: 0.2 cores
  - Memory: 128MB

### Comandos Docker Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
docker-compose logs -f api
docker-compose logs -f rabbitmq

# Parar serviços
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar e remover tudo (incluindo volumes)
docker-compose down -v

# Rebuild dos containers
docker-compose up -d --build

# Acessar shell do container
docker exec -it nest_msg_api bash
docker exec -it nest_msg_rabbitmq sh

# Ver status dos containers
docker-compose ps

# Reiniciar um serviço específico
docker-compose restart api
docker-compose restart rabbitmq
```

### Dockerfile

Usa a imagem base `devcontainers/typescript-node:0-18` com:

- Node.js 18
- TypeScript pré-instalado
- NestJS CLI global (`@nestjs/cli@10`)
- User: `node` (não-root)
- Working directory: `/home/node/nest`
- Command: `sleep infinity` (mantém container vivo para desenvolvimento)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📚 Conceitos Demonstrados

### 1. **Queue (Fila Direta)**

- Mensagem é enviada diretamente para uma fila específica
- Um único consumidor processa a mensagem (competição entre consumidores)
- Padrão **Point-to-Point** (Ponto-a-Ponto)
- Exemplo: `publishInQueue('email', message)`

### 2. **Exchange com Routing Key**

- Mensagem é enviada para um exchange em vez de diretamente para uma fila
- O exchange roteia para múltiplas filas baseado na routing key
- Múltiplos consumidores podem processar a mesma mensagem
- Padrão **Publish-Subscribe** (Publicar-Assinar)
- Exemplo: `publishInExchange('amq.direct', 'process', message)`

### 3. **Dead Letter Queue (DLQ) e Retry Automático**

- Mensagens que falham são enviadas para Dead Letter Exchange
- Fila de retry com TTL aguarda antes de reenviar para fila principal
- Contador de tentativas (`x-death`) rastreia número de retries
- Após máximo de tentativas (2), mensagem é descartada
- Garante processamento resiliente sem bloquear a fila

**Benefícios:**

- ✅ Retry automático sem código adicional
- ✅ Configurável por fila
- ✅ Evita perda de mensagens por erros temporários
- ✅ Previne loop infinito com limite de tentativas

### 4. **Acknowledgment (ACK/NACK)**

- **ACK**: Confirmação de processamento bem-sucedido
- **NACK**: Negative acknowledgment - indica falha no processamento
- Garante que mensagens não sejam perdidas
- `NACK(message, false, false)`: Não requeue, envia para DLX

```typescript
try {
  await processMessage(message);
  channel.ack(message); // Sucesso
} catch (error) {
  channel.nack(message, false, false); // Falha, envia para DLQ
}
```

### 5. **Monorepo com Bibliotecas Compartilhadas**

- Código RabbitMQ centralizado em `libs/rabbitmq`
- Reutilização entre `api` e `process` applications
- Import path mapping: `@app/rabbitmq`
- Configurado via `tsconfig.json` e `nest-cli.json`

```typescript
// Uso em qualquer aplicação
import { RabbitmqModule, RabbitmqService } from '@app/rabbitmq';
```

### 6. **Dependency Injection no NestJS**

- Providers customizados para gerenciar conexões
- Injeção de dependências via constructor
- Lifecycle hooks (OnModuleInit, OnModuleDestroy)
- ConfigService para variáveis de ambiente

### 7. **Configuração Avançada de Filas**

**Fila Durável (Persistent):**

```typescript
{
  durable: true;
} // Sobrevive a restart do RabbitMQ
```

**Dead Letter Exchange:**

```typescript
arguments: {
  'x-dead-letter-exchange': 'retry.email',
  'x-dead-letter-routing-key': 'email'
}
```

**Time-To-Live (TTL):**

```typescript
arguments: {
  'x-message-ttl': 5000 // 5 segundos
}
```

## 🔍 Monitoramento

### RabbitMQ Management UI

Acesse `http://localhost:15672` para:

- Visualizar filas e exchanges
- Monitorar taxa de mensagens
- Gerenciar connections e channels
- Publicar/consumir mensagens manualmente
- Visualizar estatísticas em tempo real

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev api          # Inicia API em modo watch
npm run start:dev process      # Inicia consumidor em modo watch

# Produção
npm run build                  # Compila todo o projeto
npm run start:prod:api         # Inicia API compilada
npm run start:prod:process     # Inicia consumidor compilado

# Build individual
npx nest build api             # Compila apenas API
npx nest build process         # Compila apenas process

# Qualidade de código
npm run format                 # Formata código com Prettier
npm run lint                   # Executa ESLint e corrige problemas

# Testes
npm run test                   # Testes unitários
npm run test:watch             # Testes em modo watch
npm run test:cov               # Testes com cobertura
npm run test:debug             # Testes em modo debug
npm run test:e2e               # Testes end-to-end
```

### Scripts do Monorepo

Para trabalhar com aplicações específicas:

```bash
# Iniciar aplicações específicas
npx nest start api             # Inicia só a API
npx nest start process         # Inicia só o consumidor
npx nest start api --watch     # API em modo watch
npx nest start process --watch # Consumidor em modo watch

# Build de aplicações específicas
npx nest build api
npx nest build process
npx nest build rabbitmq        # Compila a biblioteca
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com RabbitMQ

**Sintoma:**

```
Error: connect ECONNREFUSED 127.0.0.1:5672
```

**Soluções:**

```bash
# Verificar se RabbitMQ está rodando
docker-compose ps

# Ver logs do RabbitMQ
docker-compose logs rabbitmq

# Reiniciar RabbitMQ
docker-compose restart rabbitmq

# Verificar variável de ambiente
# Para Docker: amqp://admin:admin@rabbitmq:5672
# Para local: amqp://admin:admin@localhost:5672
```

#### 2. Mensagens não são consumidas

**Verificar:**

- Process application está rodando?
- Filas foram criadas? (Verificar no Management UI)
- Consumidores estão registrados?

```bash
# Logs do processo consumidor
docker logs -f <process_container_id>

# Verificar filas no RabbitMQ Management UI
# http://localhost:15672/#/queues
```

#### 3. Mensagens ficam em loop infinito

**Causa:** Erro no consumidor sem tratamento adequado

**Solução:**

- Verificar se o código está fazendo ACK/NACK corretamente
- Validar configuração de maxRetries
- Verificar logs para identificar o erro

#### 4. Import de biblioteca não funciona

**Sintoma:**

```
Cannot find module '@app/rabbitmq'
```

**Solução:**

```bash
# Rebuild do projeto
npm run build

# Verificar tsconfig.json tem o path mapping
# Verificar jest.config no package.json tem moduleNameMapper
```

#### 5. Docker compose não sobe

**Soluções:**

```bash
# Verificar portas em uso
lsof -i :3333
lsof -i :5672
lsof -i :15672
lsof -i :5432

# Limpar tudo e recomeçar
docker-compose down -v
docker-compose up -d --build

# Verificar logs
docker-compose logs
```

#### 6. Performance degradada

**Verificar:**

- Mensagens acumuladas nas filas (verificar Management UI)
- CPU/Memory dos containers
- Número de consumers

```bash
# Ver uso de recursos
docker stats

# Escalar consumidores (adicionar mais instances)
# Em produção, considere usar Kubernetes ou similar
```

### Dicas de Debug

```bash
# Ativar debug mode do NestJS
npm run start:debug api

# Conectar debugger do VS Code na porta 9229

# Ver mensagens no RabbitMQ Management UI
# http://localhost:15672/#/queues
# Clicar na fila → Get Messages

# Publicar mensagem manual via Management UI
# Útil para testar consumidores isoladamente
```

## 📖 Recursos de Aprendizado

Este projeto demonstra:

- ✅ **Arquitetura de Monorepo NestJS** com múltiplas aplicações
- ✅ **Bibliotecas Compartilhadas** com path mapping (`@app/rabbitmq`)
- ✅ **Integração com RabbitMQ** usando `amqplib` e `amqp-connection-manager`
- ✅ **Padrões de Mensageria** (Queue e Exchange)
- ✅ **Dead Letter Queue (DLQ)** para retry automático
- ✅ **Sistema de Retry Resiliente** com controle de tentativas
- ✅ **Dependency Injection** no NestJS
- ✅ **Providers Customizados** com useFactory
- ✅ **Lifecycle Hooks** (OnModuleInit, OnModuleDestroy)
- ✅ **ConfigModule** para gerenciamento de configuração
- ✅ **Docker e Docker Compose** para containerização
- ✅ **TypeScript** com tipos fortes e type-safe
- ✅ **Arquitetura de Microserviços** assíncrona
- ✅ **Message Acknowledgment** (ACK/NACK)
- ✅ **Tratamento de Erros** robusto em mensageria

### Cenários de Uso Real

Este projeto pode ser base para implementar:

- 📧 **Envio de Emails Assíncrono**: Processar fila de emails sem bloquear API
- 🔔 **Sistema de Notificações**: Push notifications, SMS, etc.
- 📊 **Processamento de Relatórios**: Gerar relatórios em background
- 🖼️ **Processamento de Imagens**: Resize, compressão, thumbnails
- 💳 **Processamento de Pagamentos**: Validação e confirmação assíncrona
- 📦 **Integração entre Microserviços**: Comunicação event-driven
- 🔄 **Sincronização de Dados**: Entre sistemas diferentes
- 📝 **Auditoria e Logs**: Registro assíncrono de eventos

### Próximos Passos

Para expandir este projeto, considere:

1. **Implementar Persistência**: Salvar mensagens processadas no PostgreSQL
2. **Adicionar Observabilidade**: Logs estruturados, métricas, tracing
3. **Implementar Dead Letter Storage**: Armazenar mensagens que falharam definitivamente
4. **Adicionar Autenticação**: Proteger endpoints da API
5. **Criar Exchange Patterns**: Topic, Fanout, Headers exchanges
6. **Implementar Circuit Breaker**: Proteção contra falhas em cascata
7. **Adicionar Testes**: Testes unitários e E2E para mensageria
8. **Implementar Priority Queues**: Priorização de mensagens
9. **Adicionar Message Validation**: Validar schema de mensagens
10. **Implementar Idempotência**: Prevenir processamento duplicado

## 🤝 Contribuindo

Este é um projeto educacional. Contribuições são bem-vindas!

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Ideias de Contribuição

- 📝 Melhorar documentação
- 🧪 Adicionar testes unitários e E2E
- 🔒 Implementar autenticação nos endpoints
- 💾 Adicionar persistência no PostgreSQL
- 📊 Implementar métricas e observabilidade
- 🔄 Adicionar mais padrões de exchange (topic, fanout)
- 🛡️ Implementar circuit breaker pattern
- ✨ Melhorar tratamento de erros

## 📄 Licença

Este projeto está sob a licença UNLICENSED - veja detalhes na documentação.

**Para uso educacional e comercial.**

## 👨‍💻 Autor

**Ediano Silva Santos**

- 🎯 CTO @ Insight Sales
- 💻 Desenvolvedor Full Stack especializado em Node.js | NestJS | Next.js | TypeScript
- 🌱 Interesse em Rust | Python | Go
- 📍 Porto Velho/RO - Brasil

### Conecte-se

- 🌐 Website: [ediano.dev](https://ediano.dev)
- 💼 LinkedIn: [linkedin.com/in/ediano](https://www.linkedin.com/in/ediano)
- 🐦 Twitter/X: [@euediano](https://twitter.com/euediano)
- 📸 Instagram: [@euediano](https://www.instagram.com/euediano)
- 📧 Email: silva.ediano.santos@gmail.com

Projeto criado como material educacional para tutorial em vídeo no YouTube sobre comunicação assíncrona entre aplicações NestJS usando RabbitMQ.

## 🙏 Agradecimentos

- Comunidade NestJS
- Documentação oficial do RabbitMQ
- Contributors e usuários deste projeto

## 📞 Suporte

Se você encontrar problemas ou tiver dúvidas:

1. ✅ Verifique a seção [Troubleshooting](#-troubleshooting)
2. 📖 Consulte a [documentação oficial do NestJS](https://docs.nestjs.com/)
3. 🐰 Leia a [documentação do RabbitMQ](https://www.rabbitmq.com/documentation.html)
4. 💬 Abra uma issue no repositório

---

<div align="center">

### ⭐ Se este projeto foi útil para você, considere dar uma estrela!

**Feito com ❤️ e NestJS**

[⬆ Voltar ao topo](#-comunicação-entre-aplicações-com-rabbitmq-e-nestjs)

</div>
