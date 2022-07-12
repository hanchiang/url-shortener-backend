import { expect } from 'chai';
import { Server } from 'http';

import app from '../../src/app';
import config from '../config';
import { ErrorCode } from '../../src/utils/error';
import { sendRequest } from './utils/sendRequest';

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

  it('should throw error if url key does not exist', async () => {
    const urlKey = 'unknown';
    const res = await sendRequest(server, 'get', `/${urlKey}`);
    expect(res.status).to.equal(ErrorCode.NOT_FOUND);
    expect(res.body.error.message).to.equal(
      `Short URL ${urlKey} does not exist`
    );
  });

  it('should redirect if url key exist', async () => {
    const url = 'https://www.google.com';
    const alias = 'tothemoon';
    let res = await sendRequest(server, 'post', '/urls', { url, alias });

    res = await sendRequest(server, 'get', `/${alias}`);
    expect(res.status).to.equal(307);
    expect(res.header.location).to.equal(url);
  });
});
