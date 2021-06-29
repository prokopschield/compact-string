import CompactString from './CompactString';
import fs from 'fs';

export function read(filename: string): Promise<string> {
	return fs.promises
		.readFile(filename)
		.then((data) => new CompactString(data))
		.then((a) => a.string);
}

export default read;
module.exports = read;

Object.assign(read, {
	default: read,
	read: read,
});
