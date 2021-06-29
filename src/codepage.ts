import def from './codepage/def';
import ibm from './codepage/IBM-437';
import kamenicky from './codepage/kamenicky';
import latin1 from './codepage/ISO-8859-1';
import latin2 from './codepage/ISO-8859-2';

export { def, def as main, ibm, kamenicky, latin1, latin2 };

const main = [...def];

Object.assign(main, {
	...ibm,
	ibm,
	...kamenicky,
	kamenicky,
	...latin1,
	latin1,
	...latin2,
	latin2,
	...def,
	def,
});

export default main;
module.exports = main;
