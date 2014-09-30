function binToOct(bin){
	bin = bin.split("");
	oct = "";
	for(var i = bin.length-1; i >= 0; i -= 3){
		var dec = 0;
		if(bin[i] == "1"){
			dec += 1;
		}
		if(bin[i-1] == "1"){
			dec += 2;
		}
		if(bin[i-2] == "1"){
			dec += 4;
		}
		oct = dec + oct;
	}
	return oct;
}

function binToDec(bin){
	bin = bin.split("");
	var dec = 0;
	var e = 0;
	for(var i = bin.length-1; i >= 0; i--){
		dec += bin[i] * Math.pow(2, e);
		e++;
	}
	return dec+"";
}

function octToDec(oct){
	oct = oct.split("");
	var dec = 0;
	var e = 0;
	for(var i = oct.length-1; i >= 0; i--){
		dec += oct[i] * Math.pow(8, e);
		e++;
	}
	return dec+"";
}

function octToBin(oct){
	oct = oct.split("");
	var bin = "";
	for(i in oct){
		var o = 3;
		while(o--){
			if(oct[i] >= Math.pow(2, o)){
				bin += "1";
				oct[i] -= Math.pow(2, o);
			} else {
				bin += "0";
			}
		}
	}
	return bin.substring(1, bin.length);
}

function decToBin(dec){
	dec = Math.round(dec); // Handily also de-stringifies it
	bin = "";
	var i = 8;
	while(i--){
		if(dec >= Math.pow(2, i)){
			bin += "1";
			dec -= Math.pow(2, i);
		} else {
			bin += "0";
		}
	}
	
	return bin;
}

function decToOct(dec){
	return binToOct(decToBin(dec));
}

function Register(id){
	var id = id;
	var value;

	set("00000000");
	
	function set(v){
		value = v.substring(v.length - 8, v.length);
		document.getElementById("r"+id).innerHTML = binToOct(value);
		
		document.getElementById("r"+id).className += ' written';
		setTimeout(function(){document.getElementById("r"+id).className = "registerValue"}, 10);
		
		setTimeout(
			function(){
				document.getElementById("r"+id).className += ' written';
			}
		, 0);
		
		setTimeout(
			function(){
				var classname = document.getElementById(cellIdStr+addr).className;
				if(classname.length > ' read'.length){
					document.getElementById(cellIdStr+addr).className = classname.substr(classname.length - ' read'.length, classname.length);
				} else {
					document.getElementById(cellIdStr+addr).className = "";
				}
			}
		, 200);
	}
	function get(){
		document.getElementById("r"+id).className += ' read';
		setTimeout(function(){document.getElementById("r"+id).className = "registerValue"}, 10);
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}

var Reg = {
	 a: new Register(0)     // Accumulator
	,pc: new Register(1)    // Program Counter
	,ir: new Register(2)    // Instruction Register
	,ar: new Register(3)    // Argument Register
	,op: new Register(4)    // ALU Operand
	,abr: new Register(5)   // Address Bus Register
	,din: new Register(6)   // Data Bus In
	,dout: new Register(7)  // Data Bus Out
	,pabr: new Register(8)  // Periphery Address Bus
	,pdin: new Register(9)  // Periphery Data Bus In
	,pdout: new Register(10)// Periphery Data Bus Out
	,sp: new Register(11)   // Stack Pointer
	,gp: [				    // General Purpose Registers
		 new Register(100)
		,new Register(101)
		,new Register(102)
		,new Register(103)
		,new Register(104)
		,new Register(105)
		,new Register(106)
		,new Register(107)
	]
	,reset: function(){
		Reg.a.set("00000000");
		Reg.pc.set("00000000");
		Reg.ir.set("00000000");
		Reg.ar.set("00000000");
		Reg.op.set("00000000");
		Reg.abr.set("00000000");
		Reg.din.set("00000000");
		Reg.dout.set("00000000");
		Reg.pabr.set("00000000");
		Reg.pdin.set("00000000");
		Reg.pdout.set("00000000");
		for(var i in Reg.gp){
			Reg.gp[i].set("00000000");
		}
	}
}

function Flag(id){
	var id = id;
	var value;

	set("0");
	
	function set(v){
		value = v.substring(v.length - 1, v.length);
		document.getElementById("f"+id).innerHTML = value;
		
		document.getElementById("f"+id).className += ' written';
		setTimeout(function(){document.getElementById("f"+id).className = ""}, 10);
	}
	function get(){
		document.getElementById("f"+id).className += ' read';
		setTimeout(function(){document.getElementById("f"+id).className = ""}, 10);
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}

var Flags = {
	 c: new Flag(0)
	,z: new Flag(1)
	,o: new Flag(2)
	,n: new Flag(3)
	,reset: function(){
		Flags.c.set("0");
		Flags.z.set("0");
		Flags.o.set("0");
		Flags.n.set("0");
	}
}

var Mem = function(s, tbodyId, cellIdStr, cols, addrReg){
	var size = s;
	var memory = [];
	for(var i = 0; i < size; i++){
		memory.push("00000000");
	}
	
	var memTableCols = cols;
	var tableString = "";
	
	for(var y = 0; y < Math.ceil(memory.length/memTableCols); y++){
		tableString += "<tr>";
		for(var x = 0; x < memTableCols; x++){
			var addr = y*memTableCols + x;
			tableString += '<td id="'+cellIdStr+(y*memTableCols + x)+'" title=" Octal Address '+decToOct(addr)+'">';
				if(memory[addr] != null){
					tableString += binToOct(memory[addr]);
				}
			tableString += "</td>";
		}
		tableString += "</tr>";
	}
	
	document.getElementById(tbodyId).innerHTML = tableString;
	
	function write(){
		var addr = Math.round(binToDec(addrReg.get()));
		if(addr >= size || addr < 0){
			return false;
		}
		memory[addr] = Reg.dout.get();
		
		document.getElementById(cellIdStr+addr).innerHTML = binToOct(memory[addr]);
		
		setTimeout(
			function(){
				document.getElementById(cellIdStr+addr).className += ' written';
			}
		, 0);
		
		setTimeout(
			function(){
				var classname = document.getElementById(cellIdStr+addr).className;
				if(classname.length > ' written'.length){
					document.getElementById(cellIdStr+addr).className = classname.substr(classname.length - ' written'.length, classname.length);
				} else {
					document.getElementById(cellIdStr+addr).className = "";
				}
			}
		, 200);
	}
	
	function read(){
		var addr = binToDec(addrReg.get());
		if(addr > size || addr < 0){
			return "00000000";
		}
		Reg.din.set(memory[addr]);

		setTimeout(
			function(){
				document.getElementById(cellIdStr+addr).className += ' read';
			}
		, 0);
		
		setTimeout(
			function(){
				var classname = document.getElementById(cellIdStr+addr).className;
				if(classname.length > ' read'.length){
					document.getElementById(cellIdStr+addr).className = classname.substr(classname.length - ' read'.length, classname.length);
				} else {
					document.getElementById(cellIdStr+addr).className = "";
				}
			}
		, 200);
	}
	
	function getSize(){
		return size;
	}
	
	return{
		 write: write
		,read: read
		,getSize: getSize
		,memory: memory
	}
}

var mem = new Mem(256, "ramtbody", "m", 16, Reg.abr);
var stack = new Mem(16, "stacktbody", "st", 8, Reg.sp);

var ALU = {
	add: function(a, b, useFlags){
		a = a.split("");
		b = b.split("");
		
		carry = "0";
		
		if(useFlags){
			carry = Flags.c;
		}
		
		result = "";
		for(var i = a.length-1; i >= 0; i--){
			var sum = 0;
			if(a[i]=="1"){
				sum++;
			}
			if(b[i]=="1"){
				sum++;
			}
			if(carry=="1"){
				sum++;
			}
			if(sum == 0){
				carry = "0";
				result = "0" + result;
			}
			if(sum == 1){
				carry = "0";
				result = "1" + result;
			}
			if(sum == 2){
				carry = "1";
				result = "0" + result;
			}
			if(sum == 3){
				carry = "1";
				result = "1" + result;
			}
		}
		
		if(useFlags){
			Flags.c.set(carry);
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	,and: function(a, b, useFlags){
		var result;
		var carry;
		
		if(useFlags){
			Flags.c.set(carry);
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
			// ,new Opcode('060', 'ando', Ins.ando)
		// ,new Opcode('061', 'orop', Ins.orop)
		// ,new Opcode('062', 'xoro', Ins.xoro)
		// ,new Opcode('063', 'nand', Ins.nand)
		// ,new Opcode('064', 'noro', Ins.noro)
		// ,new Opcode('065', 'xnor', Ins.xnor)
		// ,new Opcode('066', 'nota', Ins.nota)
		// ,new Opcode('067', 'rroa', Ins.rroa)
		// ,new Opcode('070', 'rsha', Ins.rsha)
		// ,new Opcode('071', 'lroa', Ins.lroa)
		// ,new Opcode('072', 'lsha', Ins.lsha)
}

var Ins = {
	 loadArgumentByte: function(){
		// Not an opcode.
		// Load memory location at PC into AR and increment PC.
		Reg.abr.set(Reg.pc.get());
		Reg.pc.set(ALU.add(Reg.pc.get(), "00000001", false));
		mem.read();
		Reg.ar.set(Reg.din.get());
	}
	,nope: function(){
		// No OPEration
		// NOPE | -
	}
	,ldam: function(){
		// Load content of location specified in next byte into Accumulator.
		// LODA | addr
		
		Ins.loadArgumentByte();
		Reg.abr.set(Reg.ar.get());
		mem.read();
		Reg.a.set(Reg.din.get());
	}
	,ldai: function(){
		// Load content of next byte into Accumulator.
		// LDAI | #
		Ins.loadArgumentByte();
		Reg.a.set(Reg.ar.get());
	}
	,jmpa: function(){
		// Jump to location specified Accumulator.
		// JMPA | -
		Reg.pc.set(Reg.a.get());
	}
	,jmpi: function(){
		// Jump to location specified in next byte.
		// JMPI | addr
		Ins.loadArgumentByte();
		Reg.pc.set(Reg.din.get());
	}
	,addc: function(){
		// Add accumulator to operand register with carry.
		// ADDC | -
		Reg.a.set(ALU.add(Reg.a.get(), Reg.op.get(), true));
	}
	,opra: function(){
		// Copy accumulator to operand register.
		// OPRA | -
		Reg.op.set(Reg.a.get());
	}
	,brcz: function(){
		// Branch to location specified in next byte if carry flag = 0
		// BRCZ | addr
		
		Ins.loadArgumentByte();
		if(Flags.c.get() == "0"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,brcs: function(){
		// Branch to location specified in next byte if carry flag = 1
		// BRCS | addr
		
		Ins.loadArgumentByte();
		if(Flags.c.get() == "1"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,brzz: function(){
		// Branch to location specified in next byte if zero flag = 0
		// BRZZ | addr
		
		Ins.loadArgumentByte();
		if(Flags.z.get() == "0"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,brzs: function(){
		// Branch to location specified in next byte if zero flag = 1
		// BRZS | addr
		
		Ins.loadArgumentByte();
		if(Flags.z.get() == "1"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,broz: function(){
		// Branch to location specified in next byte if overflow flag = 0
		// BROZ | addr
		
		Ins.loadArgumentByte();
		if(Flags.o.get() == "0"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,bros: function(){
		// Branch to location specified in next byte if overflow flag = 1
		// BROS | addr
		
		Ins.loadArgumentByte();
		if(Flags.o.get() == "1"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,brnz: function(){
		// Branch to location specified in next byte if negative flag = 0
		// BRNZ | addr
		
		Ins.loadArgumentByte();
		if(Flags.n.get() == "0"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,brns: function(){
		// Branch to location specified in next byte if negative flag = 1
		// BRNS | addr
		
		Ins.loadArgumentByte();
		if(Flags.n.get() == "1"){
			Reg.pc.set(Reg.ar.get());
		}
	}
	,cpaa: function(){
		// Copy Accumulator to general purpose register 0
		// CPAA | -
		
		Reg.gp[0].set(Reg.a.get());
	}
	,cpab: function(){
		// Copy Accumulator to general purpose register 1
		// CPAB | -
		
		Reg.gp[1].set(Reg.a.get());
	}
	,cpac: function(){
		// Copy Accumulator to general purpose register 2
		// CPAC | -
		
		Reg.gp[2].set(Reg.a.get());
	}
	,cpad: function(){
		// Copy Accumulator to general purpose register 3
		// CPAD | -
		
		Reg.gp[3].set(Reg.a.get());
	}
	,cpae: function(){
		// Copy Accumulator to general purpose register 4
		// CPAE | -
		
		Reg.gp[4].set(Reg.a.get());
	}
	,cpaf: function(){
		// Copy Accumulator to general purpose register 5
		// CPAF | -
		
		Reg.gp[5].set(Reg.a.get());
	}
	,cpag: function(){
		// Copy Accumulator to general purpose register 6
		// CPAG | -
		
		Reg.gp[6].set(Reg.a.get());
	}
	,cpah: function(){
		// Copy Accumulator to general purpose register 7
		// CPAH | -
		
		Reg.gp[7].set(Reg.a.get());
	}
	,rdaa: function(){
		// Copy general purpose register 0 to accumulator
		// RDAA | -
		
		Reg.a.set(Reg.gp[0].get());
	}
	,rdab: function(){
		// Copy general purpose register 0 to accumulator
		// RDAB | -
		
		Reg.a.set(Reg.gp[1].get());
	}
	,rdac: function(){
		// Copy general purpose register 0 to accumulator
		// RDAC | -
		
		Reg.a.set(Reg.gp[2].get());
	}
	,rdad: function(){
		// Copy general purpose register 0 to accumulator
		// RDAD | -
		
		Reg.a.set(Reg.gp[3].get());
	}
	,rdae: function(){
		// Copy general purpose register 0 to accumulator
		// RDAE | -
		
		Reg.a.set(Reg.gp[4].get());
	}
	,rdaf: function(){
		// Copy general purpose register 0 to accumulator
		// RDAF | -
		
		Reg.a.set(Reg.gp[5].get());
	}
	,rdag: function(){
		// Copy general purpose register 0 to accumulator
		// RDAG | -
		
		Reg.a.set(Reg.gp[6].get());
	}
	,rdah: function(){
		// Copy general purpose register 0 to accumulator
		// RDAH | -
		
		Reg.a.set(Reg.gp[7].get());
	}
	,clrc: function(){
		// Set carry flag to 0
		// CLRC | -
		
		Flags.c.set('0');
	}
	,setc: function(){
		// Set carry flag to 1
		// SETC | -
		
		Flags.c.set('1');
	}
	,clrz: function(){
		// Set zero flag to 0
		// CLRZ | -
		
		Flags.z.set('0');
	}
	,setz: function(){
		// Set zero flag to 1
		// SETZ | -
		
		Flags.z.set('1');
	}
	,clro: function(){
		// Set overflow flag to 0
		// CLRO | -
		
		Flags.o.set('0');
	}
	,seto: function(){
		// Set overflow flag to 1
		// SETO | -
		
		Flags.o.set('1');
	}
	,clrn: function(){
		// Set negative flag to 0
		// CLRN | -
		
		Flags.n.set('0');
	}
	,setn: function(){
		// Set negative flag to 1
		// SETN | -
		
		Flags.n.set('1');
	}
	,wrai: function(){
		// Write accumulator to address specified in next byte
		// WRTA | addr
		
		Ins.loadArgumentByte();
		Reg.abr.set(Reg.ar.get());
		Reg.dout.set(Reg.a.get());
		mem.write();
	}
	,wram: function(){
		// Write accumulator to address stored at location specified in next byte
		// WRTA | addr
		
		Ins.loadArgumentByte();
		Reg.abr.set(Reg.ar.get());
		mem.read();
		Reg.abr.set(Reg.din.get());
		Reg.dout.set(Reg.a.get());
		mem.write();
	}
	,psha: function(){
		// Push accumulator to stack
		// PSHA | -
		
		Reg.dout.set(Reg.a.get());
		stack.write();
		Reg.sp.set(ALU.add(Reg.sp.get(), "00000001", false));
	}
	,pula: function(){
		// Pull accumulator from stack
		// PULA | -
		
		Reg.sp.set(ALU.add(Reg.sp.get(), "11111111", false));
		stack.read();
		Reg.a.set(Reg.din.get());
	}
	,pshf: function(){
		// Push flags to stack
		// PSHF | -
		
		Reg.dout.set("0000" + Flags.c.get() + Flags.z.get() + Flags.o.get() + Flags.n.get());
		stack.write();
		Reg.sp.set(ALU.add(Reg.sp.get(), "00000001", false));
	}
	,pulf: function(){
		// Pull flags from stack
		// PULF | -
		
		Reg.sp.set(ALU.add(Reg.sp.get(), "11111111", false));
		stack.read();
		
		Flags.c.set(Reg.din.get().substring(5, 1));
		Flags.z.set(Reg.din.get().substring(6, 1));
		Flags.o.set(Reg.din.get().substring(7, 1));
		Flags.n.set(Reg.din.get().substring(8, 1));
	}
	,jsrt: function(){
		// Jump to subroutine, push return address to stack
		// JSRT | addr
		
		Ins.loadArgumentByte();
		Reg.dout.set(Reg.pc.get());
		stack.write();
		Reg.sp.set(ALU.add(Reg.sp.get(), "00000001", false));
		Reg.pc.set(Reg.ar.get());
	}
	,rsrt: function(){
		// Return from subroutine, pull return address from stack
		// RSRT | -
		
		Reg.sp.set(ALU.add(Reg.sp.get(), "11111111", false));
		stack.read();
		Reg.pc.set(Reg.din.get());
	}
	,ando: function(){
		// Bitwise AND of accumulator and operand register
		// ANDO | -
		
		//Reg.a.set(ALU.and());
	}
	
	
	
		// ,new Opcode('060', 'ando', Ins.ando)
		// ,new Opcode('061', 'orop', Ins.orop)
		// ,new Opcode('062', 'xoro', Ins.xoro)
		// ,new Opcode('063', 'nand', Ins.nand)
		// ,new Opcode('064', 'noro', Ins.noro)
		// ,new Opcode('065', 'xnor', Ins.xnor)
		// ,new Opcode('066', 'nota', Ins.nota)
		// ,new Opcode('067', 'rroa', Ins.rroa)
		// ,new Opcode('070', 'rsha', Ins.rsha)
		// ,new Opcode('071', 'lroa', Ins.lroa)
		// ,new Opcode('072', 'lsha', Ins.lsha)
}

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

var Control = {
	 measuredFrequency: 0
	,cycleCountSinceMeasure: 0
	,measureInterval: false
	
	,init: function(){
		Control.loadToRam();
	}
	,loadToRam: function(){
		var rom = document.getElementById('romText').value;
		
		rom = Control.assemble(rom);
		
		var startingAddress = document.getElementById('loadToAddress').value;
		startingAddress = ("000" + startingAddress).slice(-3);
		startingAddress = octToBin(startingAddress);
		
		Reg.abr.set(startingAddress);
		for(var i in rom){
			Reg.dout.set(octToBin(rom[i]));
			mem.write();
			Reg.abr.set(ALU.add(Reg.abr.get(), "00000001", false));
		}
	}
	
	,assemble: function(rawCode){
		
		function Label(address, name){
			this.address = address;
			this.name = name;
			
			return{
				 address: address
				,name: name
			}
		}
		
		var lines = rawCode.split("\n");
		var error = false;
		var errorMsg = "";
		
		var i = lines.length;
		while(i--){
			lines[i] = lines[i].split("//")[0];                 // remove comments
			lines[i] = lines[i].replace(/^\s+|\s+$/g, '');      // remove whitespace from start and end
			
			if(lines[i] == ""){
				lines.splice(i, 1);
				continue;
			}
			
			lines[i] = lines[i].split(" ");
			
			var l = lines[i].length;
			while(l--){
				if(/^[a-z]+$/i.test(lines[i][l]) === true){	 // check if alphabetic
					if(lines[i][l].substring(0, 1) != "$"){
						var mnemonic = lines[i][l];
						lines[i][l] = Opcodes.mnemonicToOct(lines[i][l]);
						if(lines[i][l] == ""){
							error = true;
							errorMsg += "Unknown instruction: "+mnemonic+" on line "+(Math.round(i)+1)+"\n";
						}
					}
				}
				if(lines[i][l].substring(0, 1) == "#"){
					lines[i][l] = binToOct(lines[i][l].substring(1, lines[i][l].length));
				}
				if(lines[i][l] == ""){
					lines[i].splice(l, 1);
					continue;
				}
			}
		}
		
		var instructions = [];
		var labels = [];
		
		var startingAddress = document.getElementById('loadToAddress').value;
		startingAddress = ("000" + startingAddress).slice(-3);
		startingAddress = Math.round(octToDec(startingAddress));
		
		for(var i in lines){
			for(var l in lines[i]){
				var ins = lines[i][l]
				if(ins.substring(0, 1) == "$" && ins.substring(ins.length - 1, ins.length) == ":"){
					labels.push(new Label(decToOct((instructions.length + startingAddress) % mem.getSize()), ins.substring(0, ins.length - 1)));
				} else {
					instructions.push(lines[i][l]);
				}
			}
		}
		
		for(var i in instructions){
			if(instructions[i].substring(0, 1) == "$"){
				for(var l in labels){
					if(labels[l].name == instructions[i]){
						instructions[i] = labels[l].address;
					}
				}
				if(instructions[i].substring(0, 1) == "$"){
					error = true;
					errorMsg += "Could not resolve label: "+instructions[i]+"\n";
				}
			}
		}
		
		if(errorMsg != ""){
			console.log(errorMsg);
		}
		//console.log(instructions);
		
		return instructions;
		
	}
	
	,clearRam: function(){
		Control.reset();
		for(var i = 0; i < mem.getSize(); i++){
			mem.write();
			Reg.abr.set(ALU.add(Reg.abr.get(), "00000001", false));
		}
		for(var i = 0; i < stack.getSize(); i++){
			stack.write();
			Reg.sp.set(ALU.add(Reg.sp.get(), "00000001", false));
		}
		Reg.abr.set("00000000");
		Reg.sp.set("00000000");
	}
	
	,cycleInterval: false
    ,cycle: function(){
		Control.cycleCountSinceMeasure++;
		
		Reg.abr.set(Reg.pc.get());
		Reg.pc.set(ALU.add(Reg.pc.get(), "00000001", false));
		
		mem.read();
		Reg.ir.set(Reg.din.get());
		
		Opcodes.runByBin(Reg.ir.get());
	}
	
	,measureFrequency: function(){
		document.getElementById("frequency").innerHTML = Control.cycleCountSinceMeasure * (1000/Config.frequencyMeasuringFrequency) + " Hz";
		Control.cycleCountSinceMeasure = 0;
	}
	
	,toggleRun: function(){
		if(Control.cycleInterval === false){
			Control.start();
		} else {
			Control.pause();
		}
	}
	
	,reset: function(){
		Control.pause();
		Reg.reset();
		Flags.reset();
	}

	,start: function(){
		document.getElementById("frequency").innerHTML = "??? Hz";
		Control.measureInterval = setInterval(Control.measureFrequency, Config.frequencyMeasuringFrequency);
		Control.cycleInterval = setInterval(Control.cycle, Config.waitMillisecondsAfterCycle);
		document.getElementById('run').className = "";
		document.getElementById('run').className = "stopButton";
		document.getElementById('run').innerHTML = "Pause";
	}

	,pause: function(){
		clearInterval(Control.measureInterval);
		Control.measureInterval = false;
		clearInterval(Control.cycleInterval);
		Control.cycleInterval = false;
		document.getElementById('run').className = "";
		document.getElementById('run').className = "runButton";
		document.getElementById('run').innerHTML = "Start";
		document.getElementById("frequency").innerHTML = "(Paused)";
	}
	,updateCycleInterval: function(){
		var newValue = document.getElementById('cycleInterval').value;
		newValue = Math.round(newValue);
		if(isNaN(newValue)){
			document.getElementById('cycleInterval').value = Config.waitMillisecondsAfterCycle;
		} else {
			Config.waitMillisecondsAfterCycle = newValue;
			if(Control.cycleInterval !== false){
				clearInterval(Control.cycleInterval);
				Control.cycleInterval = false;
				Control.cycleInterval = setInterval(Control.cycle, Config.waitMillisecondsAfterCycle);
			}
		}
	}
	,setPC: function(){
		var newPC = document.getElementById('setPC').value;
		newPC = ("000" + newPC).slice(-3);
		newPC = octToBin(newPC);
		
		Reg.pc.set(newPC);
	}
}

function Editor(div, textArea){
	var oldContent = textArea.value.split("\n");
	var selectionOffset = 0;
	var selectionLength = 0;
	
	function init(){
		var content = textArea.value.split("\n");
		var i = content.length;
		while(i--){
			updateLine(i, content[i]);
		}		
	}
	
	function onEdit(){
		var newContent = textArea.value.split("\n");
		var i = newContent.length;
		while(i--){
			if(oldContent[i] !== newContent[i]){
				updateLine(i, newContent[i]);
			}
		}	
		
	}
	
	function onScroll(){
		div.scrollTop = textArea.scrollTop;
	}
	
	function updateLine(lineNr, line){
		
		code = line.split("//")[0];
		comment = line.substring(code.length, line.length);
		comment = '<span class="e-comment">'+comment+"</span>";
		
		code = code.split(" ");
		var c = code.length;
		while(c--){
			var fragment = code[c];
			if(/^([a-z]*)$/i.test(fragment) === true && fragment.length > 0){	 // check if alphabetic
				var oct;
				oct = Opcodes.mnemonicToOct(fragment);
				if(oct == ""){
					code[c] = '<span class="e-invalid-instruction" title="Invalid instruction">'+fragment+"</span>";
				} else {
					code[c] = '<span class="e-valid-instruction" title="Opcode '+oct+'">'+fragment+"</span>";
				}
			} else if(fragment.substring(0, 1) == "$"){
				if(fragment.substring(fragment.length-1, fragment.length) == ":"){
					code[c] = '<span class="e-define-label">'+fragment+"</span>";
				} else {
					code[c] = '<span class="e-label">'+fragment+"</span>";
				}
			} else if(fragment.substring(0, 1) == "#"){
				code[c] = '<span class="e-binary" title="Octal: '+binToOct(fragment)+'">'+fragment+"</span>";
			} else if(/^([0-7]*)$/.test(fragment) === true && fragment.length > 0){
				code[c] = '<span class="e-octal" title="Binary: '+octToBin(fragment)+'">'+fragment+"</span>";
			}
		}
		
		code = code.join(" ");
		
		var newLine = code + comment;
		var content = div.innerHTML.split("\n");
		content[lineNr] = newLine;
		div.innerHTML = content.join("\n");
	}
	
	textArea.addEventListener('keydown',function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var target = e.target;
        var value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start)
                    + "    "
                    + value.substring(end);

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 4;

        // prevent the focus lose
        e.preventDefault();
		
		onEdit();
    }
},false);
	
	return{
		 onEdit: onEdit
		,onScroll: onScroll
		,init: init
	}
}
var editor = new Editor(document.getElementById("romDisplay"), document.getElementById("romText"));
editor.init();

var Config = {
	 waitMillisecondsAfterCycle: 200
	,frequencyMeasuringFrequency: 1000 // Yeah, that's a good variable name
}

Control.init();








