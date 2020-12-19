import { closeDb } from '../src/db';

after(async () => {
  await closeDb();
});