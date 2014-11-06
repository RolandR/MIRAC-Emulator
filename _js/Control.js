/*
	Manages the UI control panel.
	Allows to do stuff like load machine code to RAM, reset the machine,
	set the CPU frequency or set the Program Counter for debug purposes.
*/
var Control = {
	 measuredFrequency: 0
	,cycleCountSinceMeasure: 0
	,measureInterval: false
	,paused: true
	,cycleTimeout: null
	,superFastTimeouts: []
	
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
		
		return Assembler.assemble(rawCode);
		
	}
	
	,hardReset: function(){
		Control.reset();
		mem.reset();
		stack.reset();
	}
	
	,cycleInterval: false
    ,cycle: function(){
		Control.cycleCountSinceMeasure++;
		
		Reg.abr.set(Reg.pc.get());
		Reg.pc.set(ALU.add(Reg.pc.get(), "00000001", false));
		
		mem.read();
		Reg.ir.set(Reg.din.get());
		
		Opcodes.runByBin(Reg.ir.get());
		
		if(!Control.paused){
			if(Config.waitMillisecondsAfterCycle == 0){
				cycleTimeout = setZeroTimeout(Control.cycle);
			} else {
				cycleTimeout = setTimeout(Control.cycle, Config.waitMillisecondsAfterCycle);
			}
		}
	}
	
	,measureFrequency: function(){
		document.getElementById("frequency").innerHTML = Control.cycleCountSinceMeasure * (1000/Config.frequencyMeasuringFrequency) + " Hz";
		Control.cycleCountSinceMeasure = 0;
	}
	
	,toggleRun: function(){
		if(Control.paused){
			Control.start();
		} else {
			Control.pause();
		}
	}
	
	,reset: function(){
		Control.pause();
		Reg.reset();
		Flags.reset();
		Dev.resetAll();
	}

	,start: function(){
		document.getElementById("frequency").innerHTML = "??? Hz";
		Control.measureInterval = setInterval(Control.measureFrequency, Config.frequencyMeasuringFrequency);
		document.getElementById('run').className = "";
		document.getElementById('run').className = "stopButton";
		document.getElementById('run').innerHTML = "Pause";
		Control.paused = false;
		
		Control.cycle();
	}

	,pause: function(){
		Control.paused = true;
		clearInterval(Control.measureInterval);
		Control.measureInterval = false;
		clearTimeout(Control.cycleTimeout);
		control.cycleTimeout = null;
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
		if(document.getElementById("romInput").className == "panel"){
			document.getElementById("romInput").className = "panel bigger";
		} else {
			document.getElementById("romInput").className = "panel";
		}
	}
}
