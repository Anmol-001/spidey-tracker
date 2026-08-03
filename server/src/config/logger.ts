type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: unknown;
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, meta?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: this.formatTimestamp(),
    };

    if (meta !== undefined) {
      entry.meta = meta;
    }

    const output = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}${
      meta !== undefined ? ` ${JSON.stringify(meta)}` : ''
    }`;

    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        if (process.env['NODE_ENV'] !== 'production') {
          console.info(output);
        }
        break;
      case 'info':
      default:
        console.info(output);
        break;
    }
  }

  public info(message: string, meta?: unknown): void {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: unknown): void {
    this.log('warn', message, meta);
  }

  public error(message: string, meta?: unknown): void {
    this.log('error', message, meta);
  }

  public debug(message: string, meta?: unknown): void {
    this.log('debug', message, meta);
  }
}

export const logger = new Logger();
