import { config } from 'dotenv';

config({ path: '.env.development' });

(async function main() {
  const { appFactory } = await import('./app');

  const app = appFactory();
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listen on http://localhost:${PORT}`);
  });
})();
