import {
  pino,
  Logger,
  LoggerOptions,
  MultiStreamRes,
  DestinationStream,
} from 'pino'
import { environment } from '../config/environment'
import { EnvironmentProperties } from '../interfaces/environment-properties.interface'
import { ApplicationLogger } from '../interfaces/application-logger.interface'

export class CustomLogger implements ApplicationLogger {
  private readonly logger: Logger

  constructor(private readonly environment: EnvironmentProperties) {
    this.logger = pino(this.getOptions(), this.createMultiStream())
  }

  private getOptions(): LoggerOptions {
    return { level: this.environment.logLevel ?? 'info' }
  }

  private createMultiStream(): MultiStreamRes {
    return pino.multistream([
      { stream: process.stdout },
      { stream: this.createDestination() },
    ])
  }

  private createDestination(): DestinationStream {
    return pino.destination({
      dest: this.environment.logDir,
      sync: false,
      mkdir: true,
    })
  }

  public info(msg?: string, ...args: any[]): void
  public info<T extends object>(obj: T): void
  public info<T extends object>(obj: T, msg?: string, ...args: any[]): void {
    this.logger.info(obj, msg, ...args)
  }

  public warn(msg?: string, ...args: any[]): void
  public warn<T extends object>(obj: T): void
  public warn<T extends object>(obj: T, msg?: string, ...args: any[]): void {
    this.logger.warn(obj, msg, ...args)
  }

  public error(msg?: string, ...args: any[]): void
  public error<T extends Error>(error: T): void
  public error<T extends Error>(error: T, msg?: string, ...args: any[]): void {
    this.logger.error(error, msg, ...args)
  }
}

export const logger = new CustomLogger(environment)
