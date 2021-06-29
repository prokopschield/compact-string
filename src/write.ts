import CompactString from './CompactString';
import fs from 'fs';

export function write(filename: string, str: string): Promise<void> {
	return fs.promises.writeFile(filename, new CompactString(str).buffer);
}

export default write;
module.exports = write;

Object.assign(write, {
	default: write,
	write,
});
