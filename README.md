# Pallas

Pallas is a project that provides a platform for managing tasks. With its user-friendly interface and powerful features, Pallas makes it easy for individual users and groups.

## :test_tube: Technologies

This project utilizes the following technologies:

- Node.js
- Express
- MySQL
- SWC
- Jest
- Prisma
- Zod
- JWT
- ESLint
- Prettier
- Docker
- GitHub Actions
- Sentry
- Railway

These technologies were carefully selected to provide a robust and efficient application with the latest development standards.

## :books: How to run

This project is designed for ease of execution, and you can run it locally with the following steps.

1. Clone the repository:

```bash
git clone https://github.com/miguel5g/pallas.git
cd pallas
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.development
```

_**Note:** Fill in the required values in the `.env.development` file._

4. Start the development containers:

```bash
npm run docker:dev:up
```

5. Launch the project:

```bash
npm run start:dev
```

Congratulations! The project is now running and accessible at the following URLs and servers:

- API: `http://localhost:4000`
- SMTP Client: `http://localhost:1080`
- SMTP Server: `smtp://localhost:1025`
- MySQL Container: `mysql://root:pallas@localhost:3306/pallas`

Enjoy using the project!

## :sparkles: How to contribute

We appreciate your contributions to the Pallas project! To find out how to contribute, take a look at our contribution guide located [here](https://github.com/miguel5g/pallas/wiki#how-to-contribute-to-the-project). Thank you for your interest in making Pallas even better!
