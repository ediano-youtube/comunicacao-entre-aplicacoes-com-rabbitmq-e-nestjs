# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Publicado]

### Em Desenvolvimento

- Implementação de persistência com PostgreSQL
- Sistema de autenticação e autorização
- Métricas e observabilidade

## [0.0.1] - 2026-01-03

### Adicionado

#### Arquitetura

- Arquitetura de monorepo NestJS com duas aplicações (API e Process)
- Biblioteca compartilhada RabbitMQ (`libs/rabbitmq`)
- Configuração de Docker Compose com API, PostgreSQL e RabbitMQ
- Path mapping para bibliotecas compartilhadas (`@app/rabbitmq`)

#### API Application

- Endpoint `GET /default-nest` para teste básico
- Endpoint `GET /queue` para publicação em fila direta
- Endpoint `GET /exchange` para publicação via exchange
- Integração com biblioteca RabbitMQ compartilhada

#### Process Application

- EmailService para consumo da fila `email`
- NotificationService para consumo da fila `notifications`
- Inicialização automática de consumidores via OnModuleInit
- Tratamento de erros com retry automático

#### RabbitMQ Library

- RabbitmqService com métodos de publicação e consumo
- RabbitMQProvider para gerenciamento de conexão
- Sistema de Dead Letter Queue (DLQ) para retry automático
- Configuração de retry com TTL de 5 segundos
- Máximo de 2 tentativas antes de descartar mensagem
- Lifecycle hooks (OnModuleInit, OnModuleDestroy)
- Suporte a acknowledgment (ACK/NACK)

#### Configuração

- ConfigModule para gerenciamento de variáveis de ambiente
- Arquivo `.env.example` com configurações padrão
- TypeScript configurado para monorepo
- ESLint e Prettier para qualidade de código

#### Documentação

- README.md completo com:
  - Descrição do projeto e objetivos
  - Arquitetura detalhada com diagramas
  - Guia de instalação e configuração
  - Exemplos de uso
  - Documentação de API
  - Detalhes de implementação
  - Troubleshooting
  - Guia de scripts
  - Recursos de aprendizado
- CONTRIBUTING.md com guia de contribuição
- Comentários em código para métodos complexos

#### Docker

- Dockerfile com Node.js 18 e NestJS CLI
- Docker Compose com três serviços:
  - API (porta 3333)
  - PostgreSQL 16 (porta 5432)
  - RabbitMQ 3.8 com Management UI (portas 5672 e 15672)
- Volumes persistentes para dados
- Limites de recursos (CPU e memória)
- Network personalizada

#### Testes

- Estrutura de testes E2E configurada
- Jest configurado para monorepo

### Características

- ✅ Comunicação assíncrona entre microserviços
- ✅ Padrão Queue (fila direta)
- ✅ Padrão Exchange (publish-subscribe)
- ✅ Dead Letter Queue para retry automático
- ✅ Tratamento robusto de erros
- ✅ TypeScript com tipagem forte
- ✅ Dependency Injection
- ✅ Configuração via variáveis de ambiente
- ✅ Containerização com Docker
- ✅ Hot reload em desenvolvimento
- ✅ Monorepo com bibliotecas compartilhadas

### Tecnologias

- NestJS 10.0.0
- TypeScript 5.1.3
- RabbitMQ 3.8 (Alpine)
- PostgreSQL 16
- Docker & Docker Compose
- amqplib 0.10.4
- amqp-connection-manager 4.1.14

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Depreciado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correção de bugs
- `Segurança` para vulnerabilidades

---

[Não Publicado]: https://github.com/seu-usuario/nest/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/seu-usuario/nest/releases/tag/v0.0.1
