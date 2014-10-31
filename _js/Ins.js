/*
	Defines the MIRAC instruction set.
*/
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
		// LDAM | addr
		
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
	,subt: function(){
		// Subtract operand from accumulator.
		// SUBO | -
		
		Reg.a.set(ALU.subtract(Reg.a.get(), Reg.op.get(), true));
	}
	,mult: function(){
		// Multiply accumulator with operand.
		// MULT | -
		
		Reg.a.set(ALU.multiply(Reg.a.get(), Reg.op.get(), true));
	}
	,twco: function(){
		// Calculate two's compenent of accumulator.
		// TWCO | -
		
		Reg.a.set(ALU.twosComplement(Reg.a.get(), true));
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
		
		Reg.a.set(ALU.and(Reg.a.get(), Reg.op.get(), true));
	}
	,nand: function(){
		// Bitwise NAND of accumulator and operand register
		// NAND | -
		
		Reg.a.set(ALU.nand(Reg.a.get(), Reg.op.get(), true));
	}
	,orop: function(){
		// Bitwise OR of accumulator and operand register
		// OROP | -
		
		Reg.a.set(ALU.or(Reg.a.get(), Reg.op.get(), true));
	}
	,noro: function(){
		// Bitwise NOR of accumulator and operand register
		// NORO | -
		
		Reg.a.set(ALU.nor(Reg.a.get(), Reg.op.get(), true));
	}
	,xoro: function(){
		// Bitwise XOR of accumulator and operand register
		// XORO | -
		
		Reg.a.set(ALU.xor(Reg.a.get(), Reg.op.get(), true));
	}
	,xnor: function(){
		// Bitwise XNOR of accumulator and operand register
		// XNOR | -
		
		Reg.a.set(ALU.xnor(Reg.a.get(), Reg.op.get(), true));
	}
	,nota: function(){
		// Bitwise inversion of accumulator
		// NOTA | -
		
		Reg.a.set(ALU.not(Reg.a.get(), true));
	}
	,rroa: function(){
		// Rotate right of accumulator - abcd -> dabc
		// RROA | -
		
		Reg.a.set(ALU.rotateRight(Reg.a.get(), true));
	}
	,rsha: function(){
		// Right shift of accumulator - abcd -> 0abc
		// RSHA | -
		
		Reg.a.set(ALU.shiftRight(Reg.a.get(), true));
	}
	,lroa: function(){
		// Rotate left of accumulator - abcd -> bcda
		// LROA | -
		
		Reg.a.set(ALU.rotateLeft(Reg.a.get(), true));
	}
	,lsha: function(){
		// Left shift of accumulator - abcd -> bcd0
		// LSHA | -
		
		Reg.a.set(ALU.shiftLeft(Reg.a.get(), true));
	}
}