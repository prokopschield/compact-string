import CompactString from './CompactString';
import fs from 'fs';

export function writeSync (filename: string, str: string): void {
	return fs.writeFileSync(filename, (new CompactString(str)).buffer);
}

export default writeSync;
module.exports = writeSync;

Object.assign(writeSync, {
	default: writeSync,
	writeSync,
});
