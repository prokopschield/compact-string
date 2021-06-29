# compact-string

Compact string encoding for Node.js

#### Usage:

TypeScript: `import { encode, decode, read, write } from 'compact-string';`

JavaScript: `const { encode, decode, read, write } = require('compact-string');`

```
encode (string): CompactString;
decode (CompactString): string;
read[Sync] (filename, string);
write[Sync] (filename, string);

ByteArray = any Array<ints> or TypedArray<ints>

CompactString {
    constructor(from: number | string | ByteArray);

    get length(): number;
    get size(): number;

    write_code_point(n: number): this;
    write_string(str: string): this;
    write_buffer(b: ByteArray): this;

    next(): {
        value: string;
        done: boolean;
    };

    [Symbol.iterator](): {
        next: () => {
            value: string;
            done: boolean;
        };
    };

    get buffer(): Buffer;
    get string(): string;
}
```
