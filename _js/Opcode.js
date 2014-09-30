/*
	An opcode is run by the machine, which will execute the
	appropriate instruction defined in run.
	An opcode has a 4-letter mnemonic (example: LDAI) and a
	numeric code (example: 002 or 00000010 or 2).
	
	All MIRAC opcodes are defined in Opcodes.js.
	All Instructions are defined in Ins.js.
*/

function Opcode(oct, mnemonic, run){
	this.oct = oct;
	this.bin = octToBin(oct);
	this.dec = octToDec(oct);
	this.mnemonic = mnemonic;
	this.run = run;
	
	return{
		 oct: this.oct
		,bin: this.bin
		,dec: this.dec
		,mnemonic: this.mnemonic
		,run: this.run
	}
}