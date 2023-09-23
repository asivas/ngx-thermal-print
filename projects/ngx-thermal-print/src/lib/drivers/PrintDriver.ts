import { BehaviorSubject } from 'rxjs';
export abstract class PrintDriver {
    public abstract isConnected: BehaviorSubject<boolean>;
    public abstract connect(): void;
    public abstract write(data: any): Promise<void>;
    public abstract get isSupported(): boolean;
}