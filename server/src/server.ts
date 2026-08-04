import http from 'http';
import { app } from './app.js';
import { config } from './shared/config/config.js';
import { logger } from './shared/config/logger.js';
import { database } from './shared/config/database.js';
import { socketManager } from './shared/socket/socket.server.js';

const httpServer = http.createServer(app);

// Initialize WebSocket gateway
socketManager.initialize(httpServer);

async function startServer(): Promise<void> {
  try {
    // Attempt Database Connection
    await database.connect();

    // Start HTTP Server
    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running in [${config.nodeEnv}] mode on port ${config.port}`);
      logger.info(`📡 Health check available at: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful Shutdown Logic
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);

  httpServer.close(async () => {
    logger.info('🔒 HTTP server closed');

    try {
      await socketManager.close();
      await database.disconnect();
      logger.info('✅ Clean shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown cleanup:', error);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('⚠️ Forcing shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM').catch((err) => {
    logger.error('Error during SIGTERM:', err);
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT').catch((err) => {
    logger.error('Error during SIGINT:', err);
  });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

void startServer();
