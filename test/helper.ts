import { initDb, closeDb, flushDb } from '../src/db';

before(async () => {
  await initDb();
});

afterEach(async () => {
  await flushDb();
})

after(async () => {
  await closeDb();
});
