/*
	Manages the UI control panel.
	Allows to do stuff like load machine code to RAM, reset the machine,
	set the CPU frequency or set the Program Counter for debug purposes.
*/
var Control = {
	 measuredFrequency: 0
	,cycleCountSinceMeasure: 0
	,measureInterval: false
	
	,init: function(){
		Control.loadToRam();
	}
	,loadToRam: function(){
		var rom = document.getElementById('romText').textContent;
		
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
		
		return Assembler.assemble(rawCode);
		
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
	,toggleEditorSize: function(){
		if(document.getElementById("romInput").className == ""){
			document.getElementById("romInput").className = "bigger";
			document.getElementById("biggerButton").innerHTML = "-";
		} else {
			document.getElementById("romInput").className = "";
			document.getElementById("biggerButton").innerHTML = "+";
		}
	}
}