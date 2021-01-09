import { expect } from 'chai';
import { Server } from 'http';
import request from 'supertest';

import app from '../../src/app';
import config from '../config';
import { ErrorCode } from '../../src/utils/error';

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

  it('Should shorten url', async () => {
    const url = 'https://www.google.com';
    const alias = 'myalias';
    const res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(200);
  });

  it('Should throw error if alias is taken', async () => {
    const url = 'https://www.google.com';
    const alias = 'myalias';
    let res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(200);

    res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(ErrorCode.CONFLICT);
  });

  it('should throw error if url key does not exist', async () => {
    const urlKey = 'unknown';
    const res = await request(server).get(`/${urlKey}`);
    expect(res.status).to.equal(ErrorCode.NOT_FOUND);
    expect(res.body.error.message).to.equal(`/${urlKey} does not exist`);
  });

  it('should redirect if url key exist', async () => {
    const url = 'https://www.google.com';
    const alias = 'tothemoon';
    let res = await request(server).post('/urls').send({ url, alias });

    res = await request(server).get(`/${alias}`);
    expect(res.status).to.equal(302);
    expect(res.header.location).to.equal(url);
  });
});
