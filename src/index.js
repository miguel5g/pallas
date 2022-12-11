import { config } from 'dotenv';

import { appFactory } from './app';

config({ path: '.env.development' });

const app = appFactory();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`);
});
