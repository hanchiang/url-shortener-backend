import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import { initDb, closeDb, flushDb } from '../src/db';

before(async () => {
  await initDb();
});

afterEach(async () => {
  await flushDb();
});

after(async () => {
  await closeDb();
});
