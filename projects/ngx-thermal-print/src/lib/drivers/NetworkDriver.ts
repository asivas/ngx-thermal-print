import { PrintDriver } from './PrintDriver';
import { BehaviorSubject } from 'rxjs';

export class NetworkDriver extends PrintDriver {
  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private endpointUrl: string, private ip: string, private port: number) {
    super();
  }

  public connect(): void {
    fetch(this.endpointUrl + '/ping', { method: 'GET' })
      .then(() => this.isConnected.next(true))
      .catch(() => this.isConnected.next(false));
  }

  public get isSupported(): boolean {
    return !!window.fetch;
  }

  public async write(data: Uint8Array): Promise<void> {
    await fetch(this.endpointUrl + '/print', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip: this.ip,
        port: this.port,
        data: Array.from(data)
      })
    });
  }
}
