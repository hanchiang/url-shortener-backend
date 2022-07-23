import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import { initDb, closeDb, clearDb } from '../src/db';

before(async function () {
  {
    this.timeout(30000);
    await initDb();
  }
});

afterEach(async () => {
  await clearDb();
});

after(async () => {
  await closeDb();
});
