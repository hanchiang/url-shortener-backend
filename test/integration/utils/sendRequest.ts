import { Server } from 'http';
import request from 'supertest';

export async function sendRequest(
  server: Server,
  method: string,
  url: string,
  body?: Record<string, unknown>
) {
  if (method.toLocaleLowerCase() === 'post') {
    return request(server)
      [method](url)
      .set('origin', 'http://localhost:8080')
      .send(body);
  }
  return request(server)[method](url).set('origin', 'http://localhost:8080');
}
