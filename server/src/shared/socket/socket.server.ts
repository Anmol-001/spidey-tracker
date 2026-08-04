import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { config } from '../config/config.js';
import { logger } from '../config/logger.js';

class SocketServerManager {
  private io: SocketIOServer | null = null;

  public initialize(httpServer: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.corsOrigin,
        credentials: true,
        methods: ['GET', 'POST'],
      },
      pingTimeout: 60000,
    });

    this.setupListeners();
    logger.info('⚡ Socket.IO server initialized');
    return this.io;
  }

  private setupListeners(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      logger.info(`🔌 Socket client connected: ${socket.id}`);

      socket.on('disconnect', (reason) => {
        logger.info(`🔌 Socket client disconnected: ${socket.id} (Reason: ${reason})`);
      });
    });
  }

  public getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error('Socket.IO is not initialized. Call initialize() first.');
    }
    return this.io;
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.io) {
        this.io.close(() => {
          logger.info('⚡ Socket.IO server closed');
          this.io = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export const socketManager = new SocketServerManager();
