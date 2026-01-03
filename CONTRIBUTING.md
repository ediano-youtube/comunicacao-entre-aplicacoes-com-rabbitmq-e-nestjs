# Guia de Contribuição

Obrigado por considerar contribuir para este projeto! 🎉

## 🤝 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USERNAME/nest.git
cd nest

# Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/nest.git
```

### 2. Configuração do Ambiente

```bash
# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Inicie os containers Docker
docker-compose up -d

# Execute a API
npm run start:dev api

# Execute o consumidor (em outro terminal)
npm run start:dev process
```

### 3. Crie uma Branch

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma branch para sua feature/bugfix
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

### 4. Faça suas Alterações

- ✅ Escreva código limpo e bem documentado
- ✅ Siga o style guide do projeto (ESLint + Prettier)
- ✅ Adicione testes quando apropriado
- ✅ Mantenha commits atômicos e com mensagens descritivas

### 5. Execute os Testes

```bash
# Lint
npm run lint

# Format
npm run format

# Testes
npm run test
npm run test:e2e
```

### 6. Commit

Siga o padrão de commits convencionais:

```bash
# Exemplos de commits válidos:
git commit -m "feat: adiciona suporte a exchange topic"
git commit -m "fix: corrige retry infinito em mensagens"
git commit -m "docs: atualiza documentação do RabbitMQ service"
git commit -m "test: adiciona testes para EmailService"
git commit -m "refactor: melhora estrutura do provider"
git commit -m "chore: atualiza dependências"
```

**Prefixos de Commit:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto-e-vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Manutenção, dependências, etc

### 7. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/minha-feature

# Abra um Pull Request no GitHub
```

**No Pull Request:**

- Descreva claramente o que foi alterado
- Referencie issues relacionadas (ex: "Closes #123")
- Adicione screenshots se aplicável
- Aguarde review

## 📋 Diretrizes

### Código

- Use TypeScript com tipagem forte
- Siga os princípios SOLID
- Evite duplicação de código
- Escreva código autoexplicativo
- Adicione comentários quando necessário

### Testes

- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes alta
- Testes devem ser independentes

### Documentação

- Atualize o README.md se necessário
- Documente funções complexas com JSDoc
- Mantenha comentários atualizados

### Issues

Ao reportar bugs:

- ✅ Descreva o problema claramente
- ✅ Inclua passos para reproduzir
- ✅ Informe versões (Node, npm, etc)
- ✅ Adicione logs de erro

Ao sugerir features:

- ✅ Descreva o caso de uso
- ✅ Explique os benefícios
- ✅ Proponha uma solução (se possível)

## 🎯 Áreas para Contribuir

### Funcionalidades Pendentes

- [ ] Implementar persistência com PostgreSQL
- [ ] Adicionar autenticação nos endpoints
- [ ] Implementar métricas e observabilidade
- [ ] Adicionar mais padrões de exchange (topic, fanout, headers)
- [ ] Implementar circuit breaker
- [ ] Adicionar validação de schema de mensagens
- [ ] Implementar idempotência
- [ ] Criar CLI para gerenciamento

### Melhorias de Código

- [ ] Aumentar cobertura de testes
- [ ] Melhorar tratamento de erros
- [ ] Adicionar logging estruturado
- [ ] Otimizar performance
- [ ] Implementar health checks

### Documentação

- [ ] Adicionar diagramas de arquitetura
- [ ] Criar tutoriais em vídeo
- [ ] Traduzir para outros idiomas
- [ ] Adicionar exemplos de uso real
- [ ] Documentar boas práticas

## 🚀 Primeiros Passos

Boas issues para iniciantes:

- Issues marcadas com `good first issue`
- Issues marcadas com `documentation`
- Correção de typos
- Melhorias de README

## ❓ Dúvidas

Se tiver dúvidas:

1. Verifique a documentação
2. Procure em issues existentes
3. Abra uma nova issue com a tag `question`

## 📜 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🙏 Agradecimentos

Obrigado por contribuir! Toda ajuda é valiosa, seja código, documentação, design, ou suporte à comunidade.

---

**Happy Coding! 🚀**
