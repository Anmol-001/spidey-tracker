import { io, Socket } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

class SocketClientService {
  private socket: Socket | null = null;

  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(socketUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.info('⚡ Connected to WebSocket telemetry server:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('⚠️ Disconnected from WebSocket server:', reason);
      });
    }

    return this.socket;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClientService();
