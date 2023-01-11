# Pallas

## :test_tube: Techs

Tecnologias e ferramentas que foram utilizadas para desenvolver este projeto:

- [NodeJs](https://nodejs.org/)
- [Express](https://expressjs.com/pt-br/)
- [SWC](https://swc.rs/)
- [Jest](https://jestjs.io/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [JWT](https://jwt.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Docker](https://www.docker.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Sentry](https://sentry.io/)
- [Railway](https://railway.app/)

## :books: Instalação

Passo a passo para rodar a aplicação no seu computador.

1. Clonar repositório:

```bash
git clone https://github.com/miguel5g/pallas.git
cd pallas
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

_OBS²: Mais abaixo tem o passo a passo para criar um container docker com imagem do MySQL_

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
