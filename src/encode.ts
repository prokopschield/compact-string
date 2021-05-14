import CompactString from './CompactString';

export function encode (str: string): CompactString {
	return (new CompactString(str.length)).write_string(str);
}

export default encode;
module.exports = encode;

Object.assign(encode, {
	default: encode,
	encode,
});
