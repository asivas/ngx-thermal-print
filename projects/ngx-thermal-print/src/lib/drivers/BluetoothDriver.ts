/**
 * @Author: Zhenxiang Chen
 * @Date:   2021-12-04 14:52:35
 * @Last Modified by:   Zhenxiang Chen
 * @Last Modified time: 2021-12-26 18:16:58
 */
import { BehaviorSubject, Observable } from 'rxjs';
import { PrintDriver } from "./PrintDriver";
declare const navigator: any;
declare const BluetoothRemoteGATTCharacteristic: any;

export class BluetoothDriver extends PrintDriver {

    private readonly PRINT_SERVICE_UUID = "000018f0-0000-1000-8000-00805f9b34fb"
    private readonly PRINT_CHARACTERISTIC_UUID = "00002af1-0000-1000-8000-00805f9b34fb"

    private device?: BluetoothDevice;
    private printCharacteristic?: BluetoothRemoteGATTCharacteristic;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
        super();
    }

    public connect() {
        this.device?.gatt?.connect()
            .then(server => server.getPrimaryService(this.PRINT_SERVICE_UUID))
            .then(service => service.getCharacteristic(this.PRINT_CHARACTERISTIC_UUID))
            .then(characteristic => {
              // Cache the characteristic
              this.printCharacteristic = characteristic;
              this.isConnected.next(true);
            })
            .catch(result => {
                this.isConnected.next(false);
            });
    }


    /**
     * Request a Bluetooth device through the browser
     * return Observable<BluetoothDevice>
     */
    public requestBluetooth(): Observable<BluetoothDevice> {
        return new Observable(observer => {
            navigator.bluetooth.requestDevice({
                    filters: [{
                        services: [this.PRINT_SERVICE_UUID]
                    }]
                })
                .then((result: BluetoothDevice) => {
                    this.device = result;
                    return observer.next(result);
                }).catch(error => {
                    return observer.error(error);
                });
        });
    }

    public async write(data: Uint8Array): Promise<void> {
        if (this.printCharacteristic) {
            // writeValueWithResponse allows max 512 for operation, so we have to split the data
            const chunks = this.sliceIntoChunks(data, 512)
            for (const chunk of chunks) {
                await this.printCharacteristic.writeValueWithResponse(chunk)
            }
        }
    }

    public get isSupported(): boolean {
        return !!(navigator.bluetooth && BluetoothRemoteGATTCharacteristic.prototype.writeValueWithResponse);
    }

    private sliceIntoChunks(arr: Uint8Array, chunkSize: number): Uint8Array[] {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
}