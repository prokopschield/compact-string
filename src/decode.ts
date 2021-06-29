import CompactString from './CompactString';

export function decode(CS: CompactString): string {
	return CS.string;
}

export default decode;
module.exports = decode;

Object.assign(decode, {
	default: decode,
	decode,
});
