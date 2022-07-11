import { expect } from 'chai';
import { Server } from 'http';

import app from '../../src/app';
import config from '../config';
import { ErrorCode } from '../../src/utils/error';
import { sendRequest } from './utils/sendRequest';

let server: Server;

describe('Should sanitise inputs against xss', () => {
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

  it('Validate redirect URL', async () => {
    const res = await sendRequest(server, 'get', `/<body>`);
    expect(res.status).to.equal(ErrorCode.BAD_REQUEST);
    expect(res.body.error.message).to.equal('Invalid input');
  });

  it('Validate shorten URL', async () => {
    const res = await sendRequest(server, 'post', `/urls`, {
      url: "<script>alert('hi')</script>",
      alias: "<script>alert('hi')</script>",
    });
    expect(res.status).to.equal(ErrorCode.BAD_REQUEST);
    expect(res.body.error.message).to.equal('Invalid input');
  });
});
