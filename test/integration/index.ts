import { expect } from 'chai';
import { Server } from 'http';
import request from 'supertest';

import app from '../../src/app';
import config from '../config';

let server: Server;

describe('Integration test', () => {
  beforeEach(async () => {
    return new Promise((resolve) => {
      server = app.listen(config.port, resolve);
    });
  });

  afterEach(async () => {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      server.close(resolve as any);
    });
  });

  it('should pass', async () => {
    const res = await request(server).get('/').expect(200);
    expect(res.body.payload.includes('Service is up and running')).to.equal(
      true
    );
  });
});
