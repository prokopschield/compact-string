import CompactString from './CompactString';
import fs from 'fs';

export function readSync (filename: string): string {
	return (new CompactString(fs.readFileSync(filename))).string;
}

export default readSync;
module.exports = readSync;

Object.assign(readSync, {
	default: readSync,
	readSync,
});
