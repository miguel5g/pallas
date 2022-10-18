# Todo App

Aplicação fullstack de todo list

## :test_tube: Techs

Tecnologias e ferramentas que foram utilizadas para desenvolver este projeto:

- [NodeJs](https://nodejs.org/)
- [Express](https://expressjs.com/pt-br/)
- [SWC](https://swc.rs/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)
- [Prisma](https://www.prisma.io/)
- [GitHub Actions](https://github.com/features/actions)

## :books: Instalação

Passo a passo para rodar a aplicação no seu computador.

1. Clonar repositório:

```bash
git clone https://github.com/miguel5g/todo-app.git
cd todo-app
```

2. Instalar dependências:

```bash
npm install
```

3. Configurar variáveis de ambiente:

```bash
cp .env.example .env
```

_OBS: Preencher com suas variáveis de ambiente com a url do banco de dados PostgreSQL_

4. Executar projeto

```bash
npm run start:dev
```

### Criando container Docker PostgreSQL

```bash
docker run --name <container name> -p 5432:5432 -e POSTGRES_PASSWORD=<database password> -e POSTGRES_USER=<database user> -d postgres
# Connection url: postgresql://<database user>:<database password>@localhost:5432/todo-app?schema=public
```

## :sparkles: Contribuições

Contribuições são sempre bem-vindas!

Você pode contribuir de diversas formas, desde da sugestão de uma feature ou até mesmo mexendo no código.
