/**
 * Sistema de logging configurable para GO-POS
 * Permite controlar el nivel de logs según el ambiente
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableOfflineLogging: boolean;
}

class Logger {
  private config: LogConfig;

  constructor() {
    // Configuración por defecto basada en el ambiente
    this.config = {
      level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: true,
      enableOfflineLogging: false,
    };
  }

  setConfig(config: Partial<LogConfig>) {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  private formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  error(message: string, context?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formatted = this.formatMessage('ERROR', message, context);
      if (this.config.enableConsole) {
        console.error('❌', formatted);
      }
    }
  }

  warn(message: string, context?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      const formatted = this.formatMessage('WARN', message, context);
      if (this.config.enableConsole) {
        console.warn('⚠️', formatted);
      }
    }
  }

  info(message: string, context?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      const formatted = this.formatMessage('INFO', message, context);
      if (this.config.enableConsole) {
        console.info('ℹ️', formatted);
      }
    }
  }

  debug(message: string, context?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formatted = this.formatMessage('DEBUG', message, context);
      if (this.config.enableConsole) {
        console.log('🔍', formatted);
      }
    }
  }

  // Métodos específicos para el sistema offline
  connectivity(message: string, isOnline: boolean) {
    const emoji = isOnline ? '🟢' : '🔴';
    this.info(`${emoji} ${message}`, { connectivity: isOnline });
  }

  offline(message: string, context?: any) {
    this.info(`💾 ${message}`, context);
  }

  sync(message: string, context?: any) {
    this.info(`🔄 ${message}`, context);
  }
}

// Instancia singleton
export const logger = new Logger();

// Configurar para producción (menos logs)
if (process.env.NODE_ENV === 'production') {
  logger.setConfig({
    level: LogLevel.WARN, // Solo errores y advertencias
    enableConsole: true,
  });
}