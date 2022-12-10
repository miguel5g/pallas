import 'dotenv/config';

import { appFactory } from './app';

const app = appFactory();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listen on http://localhost:${PORT}`);
});
