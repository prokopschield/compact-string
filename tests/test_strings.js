const { encode } = require('..');
const { writeFileSync } = require('fs');

module.exports = () => {
	let testing_text = `
		🤗 — hugging face
		🤭 — face with hand over mouth
		🤫 — shushing face

		Tři tisíce tři sta třicet tři stříbrných stříkaček stříkalo přes tři tisíce tři sta třicet tři stříbrných střech!

		~ΔČüéďäĎŤčěĚĹÍľĺÄÁÉžŽôöÓůÚýÖÜŠĽÝŘťáíóúňŇŮÔšřŕŔ¼§«»
	`;
	let utf_buffer = Buffer.from(testing_text);
	ct = encode(testing_text);
	let our_buffer = ct.buffer;
	console.log(`UTF buffer takes ${utf_buffer.length} bytes, ours takes ${our_buffer.length} bytes.`);
	console.log(`That's ${Math.floor(100 * (1 - our_buffer.length / utf_buffer.length))}% more efficient!`);
	const eq = utf_buffer.toString() === ct.toString();
	console.log(`The strings look the same after decoding: ${eq}`);
	return eq;
}
