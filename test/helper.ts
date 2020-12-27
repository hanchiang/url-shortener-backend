import { initDb, closeDb } from '../src/db';

before(async () => {
  await initDb();
});

after(async () => {
  await closeDb();
});
