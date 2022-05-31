import winston from 'winston';

const options: winston.LoggerOptions = {
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      stderrLevels: ['error'],
      consoleWarnLevels: ['warn'],
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
  silent: process.env.NODE_ENV === 'test',
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
