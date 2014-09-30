/*
	Defines all opcodes available in the MIDAS assembly language
	with mnemonic and opcode.
	Instructions are defined in Ins.js.
	The structure of an Opcode is defined in Opcode.js.
*/
var Opcodes = {
	 runByOct: function(oct){
		for(var i in Opcodes.ops){
			if(Opcodes.ops[i].oct == oct){
				Opcodes.ops[i].run();
				return true();
			}
		}
		return false;
	}
	,runByBin: function(bin){
		for(var i in Opcodes.ops){
			if(Opcodes.ops[i].bin == bin){
				Opcodes.ops[i].run();
				return true;
			}
		}
		return false;
	}
	,mnemonicToOct: function(mnemonic){ // mnemonic is a truly broken word... mnemonic. mnemonic...
		mnemonic = mnemonic.toLowerCase();
		for(var i in Opcodes.ops){
			if(Opcodes.ops[i].mnemonic == mnemonic){
				return Opcodes.ops[i].oct;
			}
		}
		return '';
	}
	,ops: [
		 new Opcode('000', 'nope', Ins.nope)
		,new Opcode('001', 'ldam', Ins.ldam)
		,new Opcode('002', 'ldai', Ins.ldai)
		,new Opcode('003', 'jmpa', Ins.jmpa)
		,new Opcode('004', 'jmpi', Ins.jmpi)
		,new Opcode('005', 'opra', Ins.opra)
		,new Opcode('006', 'addc', Ins.addc)
		,new Opcode('007', 'brcz', Ins.brcz)
		,new Opcode('010', 'brcs', Ins.brcs)
		,new Opcode('011', 'brzz', Ins.brzz)
		,new Opcode('012', 'brzs', Ins.brzs)
		,new Opcode('013', 'broz', Ins.broz)
		,new Opcode('014', 'bros', Ins.bros)
		,new Opcode('015', 'brnz', Ins.brnz)
		,new Opcode('016', 'brns', Ins.brns)
		,new Opcode('017', 'cpaa', Ins.cpaa)
		,new Opcode('020', 'rdaa', Ins.rdaa)
		,new Opcode('021', 'cpab', Ins.cpab)
		,new Opcode('022', 'rdab', Ins.rdab)
		,new Opcode('023', 'cpac', Ins.cpac)
		,new Opcode('024', 'rdac', Ins.rdac)
		,new Opcode('025', 'cpad', Ins.cpad)
		,new Opcode('026', 'rdad', Ins.rdad)
		,new Opcode('027', 'cpae', Ins.cpae)
		,new Opcode('030', 'rdae', Ins.rdae)
		,new Opcode('032', 'cpaf', Ins.cpaf)
		,new Opcode('033', 'rdaf', Ins.rdaf)
		,new Opcode('034', 'cpag', Ins.cpag)
		,new Opcode('035', 'rdag', Ins.rdag)
		,new Opcode('036', 'cpah', Ins.cpah)
		,new Opcode('037', 'rdah', Ins.rdah)
		,new Opcode('040', 'clrc', Ins.clrc)
		,new Opcode('041', 'clrz', Ins.clrz)
		,new Opcode('042', 'clro', Ins.clro)
		,new Opcode('043', 'clrn', Ins.clrn)
		,new Opcode('044', 'setc', Ins.setc)
		,new Opcode('045', 'setz', Ins.setz)
		,new Opcode('046', 'seto', Ins.seto)
		,new Opcode('047', 'setn', Ins.setn)
		,new Opcode('050', 'wrai', Ins.wrai)
		,new Opcode('051', 'wram', Ins.wram)
		,new Opcode('052', 'psha', Ins.psha)
		,new Opcode('053', 'pula', Ins.pula)
		,new Opcode('054', 'pshf', Ins.pshf)
		,new Opcode('055', 'pulf', Ins.pulf)
		,new Opcode('056', 'jsrt', Ins.jsrt)
		,new Opcode('057', 'rsrt', Ins.rsrt)
		,new Opcode('060', 'anda', Ins.anda)
		,new Opcode('061', 'orac', Ins.orac)
		,new Opcode('062', 'xora', Ins.xora)
		,new Opcode('063', 'nand', Ins.nand)
		,new Opcode('064', 'nora', Ins.nora)
		,new Opcode('065', 'xnor', Ins.xnor)
		,new Opcode('066', 'nota', Ins.nota)
		,new Opcode('067', 'rroa', Ins.rroa)
		,new Opcode('070', 'rsha', Ins.rsha)
		,new Opcode('071', 'lroa', Ins.lroa)
		,new Opcode('072', 'lsha', Ins.lsha)
	]
}