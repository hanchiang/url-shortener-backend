import {
  createConnection,
  getConnection as getMysqlConnection,
  Connection,
} from 'typeorm';
import config from '../../config';

export class MySql {
  private static instance: MySql;
  private connection: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  public static async getInstance(): Promise<MySql> {
    if (!this.instance) {
      const conn = await this.connect();
      this.instance = new this(conn);
    }
    return MySql.instance;
  }

  private static async connect(): Promise<Connection> {
    return createConnection({
      type: 'mysql',
      host: config.mysqlHost,
      port: config.mysqlPort,
      username: config.mysqlUser,
      password: config.mysqlPassword,
      database: config.mysqlDb,
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
    });
  }

  public static async getConnection(name?: string): Promise<Connection> {
    return getMysqlConnection(name);
  }

  public static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.connection.close();
      this.instance = null;
    }
  }
}
