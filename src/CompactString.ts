import { ByteArray } from './types';
const CP: {
	def: string[],
	ibm: string[],
	kamenicky: string[],
	latin1: string[],
	latin2: string[],
} = require('./codepage');

const code_page_names: Array<
	  'def'
	| 'ibm'
	| 'kamenicky'
	| 'latin1'
	| 'latin2'
> = [
	'def',
	'ibm',
	'kamenicky',
	'latin1',
	'latin2',
];

const code_pages = code_page_names.map(a => CP[a]);

const emoji: {
	[index: string]: [ number, number, number, number ];
} = {
	'\ud83d': [ 0x10, 0xd83d, 0xde00, 0x00ff ],
	'\ud83e': [ 0x11, 0xd83e, 0xdd00, 0x00ff ],
}

const emoji_maps: {
	[index: number]: [ number, number, number, number ];
} = {
	0x10: [ 0x10, 0xd83d, 0xde00, 0x00ff ],
	0x11: [ 0x11, 0xd83e, 0xdd00, 0x00ff ],
}

export class CompactString {

	private _data: ByteArray;

	constructor (from: number | string | ByteArray) {
		switch (typeof from) {
			case 'number': {
				this._data = new Uint8Array(from << 2);
				this._size = from;
				break;
			}
			case 'string': {
				this._data = new Uint8Array(this._size = from.length);
				this.write_string(from);
				break;
			}
			default: {
				this._data = from;
				this._size = this._write_index = this._data.length;
				break;
			}
		}
	}

	private _size: number;

	get length (): number {
		return this._write_index;
	}

	get size (): number {
		return this._size;
	}

	private _write_index = 0;

	write_code_point (n: number): this {
		if (this._write_index > (this._size - 8)) {
			const data_old = this._data;
			this._size = ((data_old.length >> 8) + 1) << 8;
			this._data = new Uint8Array(this._size);
			this._data.set(data_old);
		}
		switch (true) {
			case (n <= 0xFF): {
				this._data[this._write_index++] = n;
				return this;
			}
			case (n <= 0x7FF): {
				this._data[this._write_index++] = 0b11000000 | (n >>  6);
				this._data[this._write_index++] = 0b10000000 | (n      ) & 0b10111111;
				return this;
			}
			case (n <= 0xFFFF): {
				this._data[this._write_index++] = 0b11100000 | (n >> 12);
				this._data[this._write_index++] = 0b10000000 | (n >>  6) & 0b10111111;
				this._data[this._write_index++] = 0b10000000 | (n      ) & 0b10111111;
				return this;
			}
			default:
				this._data[this._write_index++] = 0b11110000 | (n >> 18);
				this._data[this._write_index++] = 0b10000000 | (n >> 12) & 0b10111111;
				this._data[this._write_index++] = 0b10000000 | (n >>  6) & 0b10111111;
				this._data[this._write_index++] = 0b10000000 | (n      ) & 0b10111111;
				return this;
		}
	}

	write_string (str: string): this {
		let mode = CP.def;
		let t: number;
		for (const chr of str) {
			if (!chr) continue;
			t = mode.indexOf(chr);
			if (t !== -1) {
				this.write_code_point(t);
				continue;
			} else if (chr.length == 1) {
				for (const [ page_index, page ] of Object.entries(code_pages)) {
					(page !== mode) && (t = page.indexOf(chr));
					if (t !== -1) {
						mode = page;
						this.write_code_point(+page_index);
						this.write_code_point(t);
						continue;
					}
				}
			} else if (chr[0] in emoji) {
				const [ code_point, first, add, and ] = emoji[chr[0]];
				if (mode !== CP.def) {
					this.write_code_point(0);
					mode = CP.def;
				}
				this.write_code_point(code_point);
				this.write_code_point(chr.charCodeAt(1) & 255);
				continue;
			}
			if (mode !== CP.def) {
				this.write_code_point(0);
				mode = CP.def;
			}
			const cp = chr.codePointAt(0);
			cp && this.write_code_point(cp);
		}
		if (mode !== CP.def) {
			this.write_code_point(0);
			mode = CP.def;
		}
		return this;
	}

	write_buffer (b: Uint8Array | Uint8ClampedArray | Buffer): this {
		for (const n of b) this.write_code_point(n);
		return this;
	}

	private _read_index = 0;
	private _read_mode = CP.def;
	private _is_reading_emoji = false;
	private _emoji_being_read = emoji_maps[0x10];
	private get _is_done (): boolean {
		if (this._read_index > this._write_index) {
			this._read_index = 0;
			this._read_mode = CP.def;
			return true;
		} else return false;
	}
	next (): {
		value: string,
		done: boolean,
	} {
		const iterated_codepoint = this._data[this._read_index++];
		if (this._is_reading_emoji) {
			this._is_reading_emoji = false;
			return ({
				value: String.fromCodePoint(this._emoji_being_read[1]) + String.fromCodePoint(this._emoji_being_read[2] | iterated_codepoint),
				done: this._is_done,
			});
		} else if (emoji_maps[iterated_codepoint]) {
			this._emoji_being_read = emoji_maps[iterated_codepoint];
			this._is_reading_emoji = true;
			return this.next();
		} else if (code_pages[iterated_codepoint]) {
			this._read_mode = code_pages[iterated_codepoint];
			return this.next();
		} else if ((this._read_mode === CP.def) && iterated_codepoint > 0b10111111) {
			// iterated_codepoint is between 0b11000000 and 0b11111111
			if (
				(
					(
						iterated_codepoint & 0b11100000
					) === 0b11000000
				) && (
					(
						this._data[this._read_index] & 0b11000000
					) === 0b10000000
				)
			) {
				return ({
					value: String.fromCodePoint(
						(
							( iterated_codepoint & 0b00011111 ) << 6
						) | (
							( this._data[this._read_index++] & 0b00111111 )
						)
					),
					done: this._is_done,
				});
			} else if (
				(
					(
						iterated_codepoint & 0b11110000
					) === 0b11100000
				) && (
					(
						this._data[this._read_index] & 0b11000000
					) === 0b10000000
				) && (
					(
						this._data[this._read_index + 1] & 0b11000000
					) === 0b10000000
				)
			) {
				return ({
					value: String.fromCodePoint(
						(
							( iterated_codepoint & 0b00001111 ) << 12
						) | (
							( this._data[this._read_index++] & 0b00111111 ) << 6
						) | (
							( this._data[this._read_index++] & 0b00111111 )
						)
					),
					done: this._is_done,
				});
			} else if (
				(
					(
						iterated_codepoint & 0b11111000
					) === 0b11110000
				) && (
					(
						this._data[this._read_index] & 0b11000000
					) === 0b10000000
				) && (
					(
						this._data[this._read_index + 1] & 0b11000000
					) === 0b10000000
				) && (
					(
						this._data[this._read_index + 2] & 0b11000000
					) === 0b10000000
				)
			) {
				return ({
					value: String.fromCodePoint(
						(
							( iterated_codepoint & 0b00000111 ) << 18
						) | (
							( this._data[this._read_index++] & 0b00111111 ) << 12
						) | (
							( this._data[this._read_index++] & 0b00111111 ) << 6
						) | (
							( this._data[this._read_index++] & 0b00111111 )
						)
					),
					done: this._is_done,
				});
			}
		}
		return ({
			value: this._read_mode[iterated_codepoint],
			done: this._is_done,
		});
	}

	[Symbol.iterator](): {
		next: () => { value: string, done: boolean };
	} {
		return ({
			next: () => this.next(),
		});
	}

	get buffer(): Buffer {
		return Buffer.from(this._data).slice(0, this._write_index);
	}

	get string(): string {
		return [ ...this ].join('');
	}

	toString(): string {
		return this.string;
	}
}

export default CompactString;
module.exports = CompactString;

Object.assign(CompactString, {
	default: CompactString,
	CompactString,
});
