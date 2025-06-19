const pino = require('pino');
const ecsFormat = require('@elastic/ecs-pino-format');

const logger = pino({
    ...ecsFormat(),
    level: 'info'
  }, pino.destination({dest:'./logs/app.log',mkdir: true }));

module.exports = logger

