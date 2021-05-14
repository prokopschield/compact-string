const main = [
	'\u0000', // 0x00 // End Code Page
	'\u0001', // 0x01 // Begin IBM Code Page 437
	'\u0002', // 0x02 // Begin Kamenický
	'\u0003', // 0x03 // Begin ISO-8859-1
	'\u0004', // 0x04 // Begin ISO-8859-2
	'\u0005', // 0x05 // Reserved for future use
	'\u0006', // 0x06 // Reserved for future use
	'\u0007', // 0x07 // Ring a bell
	'\u0008', // 0x08 \b BACKSPACE
	'\u0009', // 0x09 \t TAB
	'\u000A', // 0x0A \n NEW LINE
	'\u000B', // 0x0B \v CTRL ENTER - VERTICAL TAB
	'\u000C', // 0x0C \f NEW PAGE - FORM FEED
	'\u000D', // 0x0D \r CARRIGE RETURN
	'\u000E', // 0x0E // Reserved for future use
	'\u000F', // 0x0F // Reserved for future use
	'\ud83d', // 0x10 EMOJI 0xd83ddeXX
	'\ud83e', // 0x11 EMOJI 0xd83eddXX
	'\u0012', // 0x12 // Reserved for future use
	'\u0013', // 0x13 // Reserved for future use
	'\u0014', // 0x14 // Reserved for future use
	'\u0015', // 0x15 // Reserved for future use
	'\u0016', // 0x16 // Reserved for future use
	'\u0017', // 0x17 // Reserved for future use
	'\u0018', // 0x18 // Reserved for future use
	'\u0019', // 0x19 // Reserved for future use
	'\u001A', // 0x1A // Reserved for future use
	'\u001B', // 0x1B ^ - ESCAPE
	'\u001C', // 0x1C File seperator
	'\u001D', // 0x1D Group seperator
	'\u001E', // 0x1E Record seperator
	'\u001F', // 0x1F Unit seperator
	...(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ΔČüéďäĎŤčěĚĹÍľĺÄÁÉžŽôöÓůÚýÖÜŠĽÝŘťáíóúňŇŮÔšřŕŔ¼§«»').split(''),
	...('°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ').split(''),
];

export default main;
module.exports = main;

Object.assign(main, {
	default: main,
	main,
});
