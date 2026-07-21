import chalk from "chalk";
import figlet from "figlet";
import * as fs from "fs";
import OS from "os";
import path from "path";

export const pipe =
  (...functions: any[]) =>
  (initialValue: any) =>
    functions.reduce(
      (currentValue, currentFunction) => currentFunction(currentValue),
      initialValue,
    );

export const pipeAsync =
  (...functions: any[]) =>
  (initialValue: any) =>
    functions.reduce(
      (accumulatorPromise, currentFunction) =>
        accumulatorPromise.then(currentFunction),
      Promise.resolve(initialValue),
    );

export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.log(chalk.hex("#FF8800").bold(`${message}`), ...args);
    }
  },
  error: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.error(chalk.red.bold(`${message}`), ...args);
    }
  },
};

export const drawBanner = (headline: string) => {
  logger.info(figlet.textSync(headline));
};

export const isValidTime = (timeString: string) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const getfulldate = () =>
  `${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth() + 1)).slice(-2)}/${new Date().getFullYear()}`;

export const fsValidation = (
  filePath: string,
  allowedExtensions: string | any[],
) => {
  if (!filePath || typeof filePath !== "string") {
    return false;
  }
  const ext = path.extname(filePath).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return false;
  }

  try {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      return false;
    }
    const stats = fs.statSync(absolutePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

export const getSystemCpuLoad = () => {
  const cpus = OS.cpus();
  let totalMs = 0;
  let idleMs = 0;

  cpus.forEach((core: { times: { [x: string]: number; idle: number } }) => {
    for (let type in core.times) {
      totalMs += core?.times[type as keyof typeof core.times];
    }
    idleMs += core.times.idle;
  });

  return { totalMs, idleMs };
};
