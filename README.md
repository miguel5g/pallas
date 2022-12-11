# Castiel

Taskfy API.

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
cp .env.example .env.development
```

_OBS: Preencher com suas variáveis de ambiente com a url do banco de dados MySQL_

4. Executar projeto

```bash
npm run start:dev
```

### Criando e configurando container MySQL com Docker

Para criar você pode utilizar o seguinte comando:

```bash
docker run --name <container name> -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<password> -d mysql:8
```

**Connection url:** `mysql://root:<password>@localhost:3306/<database name>`

Para continuar com o desenvolvimento precisamos criar um shadow database para poder criar migrations.

```bash
docker exec -i <container name> mysql -uroot -p<password> <<< "CREATE DATABASE <database name>_shadow;"
```

**Shadow connection url:** `mysql://root:<password>@localhost:3306/<database name>_shadow`

## :sparkles: Contribuições

Contribuições são sempre bem-vindas!

Você pode contribuir de diversas formas, desde da sugestão de uma feature ou até mesmo mexendo no código.
