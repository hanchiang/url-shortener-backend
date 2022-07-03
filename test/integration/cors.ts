import { expect } from 'chai';
import { Server } from 'http';
import request from 'supertest';

import app from '../../src/app';
import config from '../config';
import { ErrorCode } from '../../src/utils/error';

let server: Server;

describe('Redirect Url integration test', () => {
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

  it('request is not allowed from origins other than localhost:8080', async () => {
    const urlKey = 'unknown';
    const res = await request(server)
      .get(`/${urlKey}`)
      .set('origin', 'http://localhost:8081');
    expect(res.status).to.equal(ErrorCode.INTERNAL_SERVER_ERROR);
  });
});
