import { expect } from 'chai';
import { Server } from 'http';
import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import config from '../config';
import { ErrorCode } from '../../src/utils/error';

let server: Server;

describe('Shorten Url integration test', () => {
  beforeEach(async () => {
    return new Promise((resolve) => {
      server = app.listen(config.port, resolve);
    });
  });

  afterEach(async() => {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    })
  })

  it('Should shorten url', async () => {
    const url = 'https://www.google.com';
    const alias = 'myalias';
    const res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(200);
    expect(res.body.payload.endsWith(alias));
  });

  it('Should throw error if alias is taken', async () => {
    const url = 'https://www.google.com';
    const alias = 'myalias';
    let res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(200);

    res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(ErrorCode.CONFLICT);
  });

  it('Should throw error if alias is too long', async () => {
    const url = 'https://www.google.com';
    const alias = faker.lorem.words(50);
    const res = await request(server).post('/urls').send({ url, alias });

    expect(res.status).to.equal(400);
  });

  it('Should throw error if alias already exist', async () => {
    const url = 'https://www.google.com';
    const alias = 'abc';

    let res = await request(server).post('/urls').send({ url, alias });
    res = await request(server).post('/urls').send({ url, alias });
    expect(res.status).to.equal(ErrorCode.CONFLICT);
    expect(res.body.error.message).equal(
      `Alias ${alias} is already taken. Please use another alias`
    );
  });
});
