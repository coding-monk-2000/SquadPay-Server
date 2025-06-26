import pino from "pino";
import ecsFormat from "@elastic/ecs-pino-format";

const logger = pino(
  {
    ...ecsFormat(),
    level: "info",
  },
  pino.destination({ dest: "./logs/app.log", mkdir: true }),
);

export default logger;
