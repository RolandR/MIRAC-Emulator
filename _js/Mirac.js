/*
	All registers, flags and memory banks are defined here.
*/

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

var mem = new Mem(256, "ramtbody", "m", 16, Reg.abr, Reg.din, Reg.dout);
var stack = new Mem(16, "stacktbody", "st", 8, Reg.sp, Reg.din, Reg.dout);






