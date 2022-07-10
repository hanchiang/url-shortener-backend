import { expect } from 'chai';
import { Server } from 'http';

import app from '../../src/app';
import config from '../config';
import { ErrorCode } from '../../src/utils/error';
import { sendRequest } from './utils/sendRequest';

let server: Server;

describe('Health check', () => {
  beforeEach(async () => {
    return new Promise((resolve) => {
      server = app.listen(config.port, resolve);
    });
  });

  afterEach(async () => {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });

  it('Health check should succeed for postgres and redis', async () => {
    const res = await sendRequest(server, 'get', `/healthz?postgres&redis`);
    expect(res.status).to.equal(ErrorCode.OK);
    expect(res.body.payload).to.eql({
      message: 'Service is up and running!',
      postgres: 'Postgres is up and running!',
      redis: 'Redis is up and running!',
    });
  });
});
