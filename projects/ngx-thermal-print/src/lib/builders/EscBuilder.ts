import { PrintBuilder } from './PrintBuilder';
import { PrintBuffer } from "./PrintBuffer";
declare var TextEncoder: any;

const ESC = 0x1b;
const GS = 0x1D;
const FS = 0x1C;

export class EscBuilder extends PrintBuilder {
    private encoder = new TextEncoder();
    private buffer: PrintBuffer;

    constructor() {
        super();
    }

    init(): EscBuilder {
        this.buffer = new PrintBuffer();
        this.write(ESC);
        this.write("@");
        return this;
    }

    flush(): Uint8Array {
        return this.buffer.flush();
    }

    feed(lineCount: number = 1): EscBuilder {
        this.write(ESC);
        this.write("d");
        this.write(lineCount);
        return this;
    }

    cut(cutType: string = 'full'): EscBuilder {
        this.write(GS);
        this.write("V");
        this.write(cutType === 'full' ? 1 : 0);

        return this;
    }

    writeLine(value: string): EscBuilder {
        return this.write(`${value}\n`);
    }

    setInverse(inverse: boolean = true): EscBuilder {
        this.write(GS);
        this.write("B");
        this.write(inverse ? 1 : 0);

        return this;
    }

    setUnderline(value: boolean = true): EscBuilder {
        this.write(ESC);
        this.write("-");
        this.write(value ? 1 : 0);
        return this;
    }

    writeLogo(kc1:number = 32,kc2:number = 32): EscBuilder {
        this.write(GS);
        this.write("(");
        this.write('L')
        this.write(0x06)
        this.write(0x00)
        this.write(0x30)
        this.write(0x45)
        this.write(kc1)
        this.write(kc2)
        this.write(1)
        this.write(1)
        return this;
    }

    setJustification(value: string = 'left'): EscBuilder {
        let alignment;
        switch (value) {
            case "center":
                alignment = 1
                break;
            case "right":
                alignment = 2;
                break;
            default:
                alignment = 0;
                break;
        }
        this.write(ESC);
        this.write("a");
        this.write(alignment);

        return this;
    }

    setBold(bold: boolean = true): EscBuilder {
        this.write(ESC);
        this.write("E");
        this.write(bold ? 1 : 0);

        return this;
    }

    /**
     * @param size
     */
    setSize(size: string = 'normal'): EscBuilder {
        this.write(ESC);
        this.write("!");
        this.write((size === 'normal') ? 0 : 0x30);

        return this;
    }

  /**
   * Set double-strike mode on/off
   * @param double
   */
  setDouble(double: boolean = true): EscBuilder {
      this.write(ESC);
      this.write("G");
      this.write(double?1:0);
      return this
    }

    private write(value: string | Uint8Array | number): any {
        if (typeof value === "number") {
            this.buffer.writeUInt8(value);
        } else if (typeof value === "string") {
            this.buffer.write(this.encoder.encode(value));
        } else {
            this.buffer.write(value);
        }
        return this;
    }
}
