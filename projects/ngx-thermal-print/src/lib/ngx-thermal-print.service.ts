/**
 * @Author: Zhenxiang Chen
 * @Date:   2021-11-24 22:01:46
 * @Last Modified by:   Zhenxiang Chen
 * @Last Modified time: 2021-12-04 14:21:32
 */
import { PrintBuilder } from './builders/PrintBuilder';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from './drivers/PrintDriver';
import { EscBuilder } from './builders/EscBuilder';

@Injectable({
  providedIn: 'root'
})
export class PrintService extends PrintBuilder {
  public printLanguage: string;
  public driver: PrintDriver;
  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public builder: PrintBuilder;

  constructor() {
    super();
  }

  /**
   *
   * @param driver UsbDriver | WebPrintDriver
   * @param printLanguage ESC/POS | StarPRNT | WebPRNT
   */
  setDriver(driver: PrintDriver, printLanguage: string = 'ESC/POS'): PrintService {
    this.driver = driver;
    this.printLanguage = printLanguage;
    this.driver.connect();

    this.driver.isConnected.subscribe(result => {
      this.isConnected.next(result);
    });

    return this;
  }

  /**
   * Initialize a new print queue
   */
  init(): PrintService {
    if (!this.driver) {
      throw "Cannot initiate the print service.  No connection detected.";
    }

    switch (this.printLanguage) {
      default:
        this.builder = new EscBuilder();
        break;
    }

    this.builder.init();
    return this;
  }

  /**
   *
   * @param cutType full|partial
   */
  public cut(cutType: string = 'full'): PrintService {
    this.builder.cut(cutType);
    return this;
  }

  /**
   *
   * @param lineCount How many lines to feed
   */
  public feed(lineCount: number = 1): PrintService {
    this.builder.feed(lineCount);
    return this;
  }

  setInverse(value: boolean = true): PrintService {
    this.builder.setInverse(value);
    return this;

  }

  setBold(value: boolean = true): PrintService {
    this.builder.setBold(value);
    return this;

  }

  setUnderline(value: boolean = true): PrintService {
    this.builder.setUnderline(value);
    return this;

  }

  /**
   *
   * @param value left|center\right
   */
  setJustification(value: string = 'left'): PrintService {
    this.builder.setJustification(value);
    return this;
  }

  /**
   *
   * @param value normal|large
   */
  setSize(value: string = 'normal'): PrintService {
    this.builder.setSize(value);
    return this;
  }

  /**
   *
   * @param text
   */
  writeLine(text: string = ''): PrintService {
    this.builder.writeLine(text);
    return this;
  }

  writeLogo(kc1:number = 32,kc2:number = 32): PrintService {
    this.builder.writeLogo(kc1, kc2);
    return this;
  }

  /**
   * write the current builder value to the driver and clear out the builder
   */
  flush() {
    this.driver.write(this.builder.flush());
  }
}
