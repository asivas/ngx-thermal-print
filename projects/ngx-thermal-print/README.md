
# Angular Thermal Printer Library

A library for connecting Angular apps with thermal printers.

## Drivers

1. WEBUSB API (No drivers needed. Only works with Chrome and Opera with USB connection)

2. WebPRNT (http)

## Print Language Drivers

1. ESC/POS

## Installation

Install library

`npm install @asivas/ngx-thermal-print`

    NOTE: 
    
 if when compiling project you get an error like this:

  `ERROR in node_modules/ngx-thermal-print/lib/drivers/UsbDriver.d.ts:16:30 - error TS2304: Cannot find name 'USBDevice'. requestUsb(): Observable;`

then add reference to w3c-web-usb by installing it with command: 

`npm install @types/w3c-web-usb --only=dev`

Import into your application
```ts
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { ThermalPrintModule } from '@asivas/ngx-thermal-print'; //add this line
    import { AppComponent } from './app.component';

    @NgModule({
       declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            ThermalPrintModule //add this line
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
    export class AppModule { }
```

## Example Usage

app.component.ts
```ts
    import { PrintService, UsbDriver } from '@asivas/ngx-thermal-print';
    import { Component } from '@angular/core';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    export class AppComponent {
        status: boolean = false;
        usbPrintDriver: UsbDriver;        
        ip: string = '';

        constructor(private printService: PrintService) {
            this.usbPrintDriver = new UsbDriver();
            this.printService.isConnected.subscribe(result => {
                this.status = result;
                if (result) {
                    console.log('Connected to printer!!!');
                } else {
                console.log('Not connected to printer.');
                }
            });
        }

        requestUsb() {
            this.usbPrintDriver.requestUsb().subscribe(result => {
                this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
            });
        }
        
        print(driver: PrintDriver) {
            this.printService.init()
                .setBold(true)
                .writeLine('Hello World!')
                .setBold(false)
                .feed(4)
                .cut('full')
                .flush();
        }
    }
```

app.component.html
```angular2html
    <strong>Status: {{status}}</strong>    

    <div>
        <button (click)="requestUsb()">Connect to USB</button>
    </div>

    <div>
        <button (click)="print()" [disabled]="status === false"> Print!</button>
    </div>
```
