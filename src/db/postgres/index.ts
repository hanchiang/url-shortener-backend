import {
  createConnection,
  getConnection as getDbConnection,
  Connection,
} from 'typeorm';
import config from '../../config';

export class Postgres {
  private static instance: Postgres;
  private connection: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  public static async getInstance(): Promise<Postgres> {
    if (!this.instance) {
      const conn = await this.connect();
      this.instance = new this(conn);
    }
    return this.instance;
  }

  private static async connect(): Promise<Connection> {
    return createConnection({
      type: 'postgres',
      host: config.postgresHost,
      port: config.postgresPort,
      username: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
    });
  }

  public static async getConnection(): Promise<Connection> {
    return getDbConnection();
  }

  public static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.connection.close();
      this.instance = null;
    }
  }
}
