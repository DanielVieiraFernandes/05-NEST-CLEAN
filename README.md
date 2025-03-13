# 🧼 NestJS Clean Architecture

Este repositório implementa a **Clean Architecture** com **NestJS**, seguindo boas práticas de DDD (Domain-Driven Design), TDD (Test-Driven Development) e SOLID.

## 🚀 Tecnologias

- **Node.js**
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **TypeScript**
- **Vitest**

## 📂 Estrutura do Projeto

```bash
src/
|-- application/        # Casos de uso (Use Cases)
|-- domain/            # Entidades e regras de negócio
|-- infra/             # Implementações de banco de dados e serviços
|-- presentation/      # Controladores e rotas
|-- test/              # Testes e setup de integração
```

## ✅ Funcionalidades

- Responder perguntas
- Escolher a melhor resposta
- Comentar em perguntas e respostas
- Deletar comentários
- Notificações em tempo real

## 🔧 Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/DanielVieiraFernandes/05-NEST-CLEAN
```

2. Instale as dependências:

```bash
yarn install
```

3. Configure o arquivo `.env` com as variáveis de ambiente:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

4. Execute as migrações do Prisma:

```bash
yarn prisma migrate dev
```

5. Inicie