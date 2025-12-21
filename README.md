# 🐰 Comunicação entre Aplicações com RabbitMQ e NestJS

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Sobre o Projeto

Este projeto é um exemplo prático de comunicação assíncrona entre aplicações usando **RabbitMQ** como message broker e **NestJS** como framework. Foi desenvolvido como material de apoio para um tutorial em vídeo no YouTube, demonstrando dois padrões principais de mensageria:

- **Queue (Fila Direta)**: Envio de mensagens diretamente para filas específicas
- **Exchange (Publicador/Assinante)**: Distribuição de mensagens através de exchanges com routing keys

### 🎯 Objetivo

Demonstrar de forma clara e prática como implementar comunicação assíncrona entre microserviços utilizando RabbitMQ, incluindo:
- Publicação de mensagens em filas
- Publicação de mensagens em exchanges
- Consumo de mensagens de múltiplas filas
- Configuração de ambiente com Docker

## 🏗️ Arquitetura

O projeto é composto por duas aplicações NestJS independentes:

### 1. **API** (`apps/api`)
Aplicação REST que expõe endpoints para publicar mensagens no RabbitMQ.

**Endpoints:**
- `GET /default-nest` - Endpoint de teste básico
- `GET /queue` - Publica mensagem diretamente na fila `email`
- `GET /exchange` - Publica mensagem no exchange `amq.direct` com routing key `rmq-process`

### 2. **RMQ-Process** (`apps/rmq-process`)
Aplicação consumidora que processa mensagens das filas do RabbitMQ.

**Consumidores:**
- **EmailService**: Consome mensagens da fila `email`
- **NotificationService**: Consome mensagens da fila `notifications`

### 📊 Fluxo de Dados

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   API       │────────▶│  RabbitMQ    │────────▶│  RMQ-Process    │
│             │         │              │         │                 │
│ GET /queue  │────────▶│ Queue: email │────────▶│  EmailService   │
│             │         │              │         │                 │
│GET /exchange│────────▶│ Exchange:    │────────▶│NotificationSvc  │
│             │         │ amq.direct   │         │  EmailService   │
└─────────────┘         └──────────────┘         └─────────────────┘
```

## 🚀 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** v10 - Framework Node.js progressivo
- **[RabbitMQ](https://www.rabbitmq.com/)** 3.8 - Message Broker
- **[TypeScript](https://www.typescriptlang.org/)** 5.1 - Superset JavaScript
- **[Docker](https://www.docker.com/)** & **Docker Compose** - Containerização
- **[PostgreSQL](https://www.postgresql.org/)** 16 - Banco de dados (preparado para uso futuro)
- **amqplib** - Client AMQP para Node.js
- **amqp-connection-manager** - Gerenciamento de conexões RabbitMQ

## 📦 Estrutura do Projeto

```
.
├── apps/
│   ├── api/                      # Aplicação produtora de mensagens
│   │   ├── src/
│   │   │   ├── rabbitmq/         # Módulo RabbitMQ
│   │   │   │   ├── rabbitmq.module.ts
│   │   │   │   ├── rabbitmq.provider.ts
│   │   │   │   └── rabbitmq.service.ts
│   │   │   ├── app.controller.ts # Endpoints REST
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts    # Lógica de publicação
│   │   │   └── main.ts
│   │   └── test/
│   │
│   └── rmq-process/              # Aplicação consumidora de mensagens
│       ├── src/
│       │   ├── rabbitmq/         # Módulo RabbitMQ
│       │   │   ├── rabbitmq.module.ts
│       │   │   ├── rabbitmq.provider.ts
│       │   │   └── rabbitmq.service.ts
│       │   ├── email.service.ts       # Consumidor da fila 'email'
│       │   ├── notification.service.ts # Consumidor da fila 'notifications'
│       │   ├── rmq-process.module.ts
│       │   ├── rmq-process.service.ts
│       │   └── main.ts
│       └── test/
│
├── docker-compose.yml            # Orquestração de containers
├── Dockerfile                    # Imagem Docker da aplicação
├── nest-cli.json                 # Configuração do NestJS CLI
├── package.json                  # Dependências do projeto
├── tsconfig.json                 # Configuração TypeScript
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

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie os containers Docker

```bash
docker-compose up -d
```

Isso irá iniciar:
- **API** na porta `3333`
- **PostgreSQL** na porta `5432`
- **RabbitMQ** nas portas `5672` (AMQP) e `15672` (Management UI)

### 4. Acesse o RabbitMQ Management

Abra o navegador em: `http://localhost:15672`

**Credenciais:**
- **Usuário:** `admin`
- **Senha:** `admin`

## 🎮 Como Usar

### Executando a API

```bash
# Modo desenvolvimento
npm run start:dev

# Build de produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3333`

### Testando os Endpoints

#### 1. Publicar na fila direta (Queue)

```bash
curl http://localhost:3333/queue
```

Este endpoint:
- Publica uma mensagem na fila `email`
- A mensagem será consumida pelo `EmailService` no `rmq-process`

#### 2. Publicar via Exchange

```bash
curl http://localhost:3333/exchange
```

Este endpoint:
- Publica uma mensagem no exchange `amq.direct` com routing key `rmq-process`
- A mensagem será distribuída para as filas vinculadas ao exchange
- Será consumida pelos serviços `EmailService` e `NotificationService`

### Executando o Consumidor (RMQ-Process)

```bash
# Em outro terminal
npm run start rmq-process
```

Os consumidores iniciarão automaticamente e exibirão no console as mensagens recebidas.

## 📝 Detalhes de Implementação

### RabbitMQ Service

O serviço RabbitMQ (`rabbitmq.service.ts`) fornece métodos para:

```typescript
// Publicar em uma fila específica
publishInQueue(queue: 'email' | 'notifications', message: string)

// Publicar em um exchange
publishInExchange(exchange: 'amq.direct', routingKey: 'rmq-process', message: string)

// Consumir mensagens de uma fila
consume(queue: 'email' | 'notifications', callback: (message: Message) => void)
```

### Provider Pattern

O projeto utiliza o padrão Provider do NestJS para gerenciar a conexão com RabbitMQ:

```typescript
// rabbitmq.provider.ts
{
  provide: 'RABBITMQ_PROVIDER',
  useFactory: async () => {
    const connection = await connect(['amqp://admin:admin@rabbitmq:5672']);
    return connection.createChannel();
  }
}
```

### Consumidores Automáticos

Os serviços de consumo implementam `OnModuleInit` para iniciar automaticamente:

```typescript
async onModuleInit() {
  await this.rabbitmqService.start();
  await this.rabbitmqService.consume('email', (message) => {
    console.log(message.content.toString());
    // Processar mensagem (ex: salvar no banco)
  });
}
```

## 🐳 Docker

### Serviços Configurados

- **api**: Aplicação NestJS principal
- **postgres**: Banco de dados PostgreSQL 16
- **rabbitmq**: Message broker com management UI

### Recursos Limitados

```yaml
deploy:
  resources:
    limits:
      cpus: "0.5"      # PostgreSQL
      memory: "128m"    # PostgreSQL
```

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
- Um único consumidor processa a mensagem
- Padrão Point-to-Point

### 2. **Exchange com Routing Key**
- Mensagem é enviada para um exchange
- O exchange roteia para múltiplas filas baseado na routing key
- Múltiplos consumidores podem processar a mesma mensagem
- Padrão Publish-Subscribe

### 3. **Acknowledgment (ACK)**
- Confirmação de processamento de mensagens
- Garante que mensagens não sejam perdidas
- Implementado com `channel.ack(message)`

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
npm run build          # Compilar o projeto
npm run start          # Iniciar em modo produção
npm run start:dev      # Iniciar em modo desenvolvimento
npm run start:debug    # Iniciar em modo debug
npm run format         # Formatar código com Prettier
npm run lint           # Executar ESLint
```

## 📖 Recursos de Aprendizado

Este projeto demonstra:
- ✅ Configuração de monorepo NestJS
- ✅ Integração com RabbitMQ
- ✅ Padrões de mensageria (Queue e Exchange)
- ✅ Dependency Injection no NestJS
- ✅ Providers customizados
- ✅ Lifecycle hooks (OnModuleInit)
- ✅ Docker e Docker Compose
- ✅ TypeScript com tipos fortes
- ✅ Arquitetura de microserviços

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se à vontade para:
- Fazer fork do projeto
- Criar issues com sugestões
- Enviar pull requests com melhorias
- Usar como base para seus próprios projetos

## 📄 Licença

Este projeto é licenciado sob a licença UNLICENSED - veja o arquivo de licença para detalhes.

## 👨‍💻 Autor

Projeto criado como material educacional para tutorial em vídeo no YouTube.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
