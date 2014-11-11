/*
	Defines all periphery devices connected to the MIRAC 
	periphery device bus.
*/

function Device(address, device){
	this.address = address;
	this.device = device;
	return {
		 address: this.address
		,device: this.device
	};
}

var Dev = {
	 getByAddress: function(address){
		var oct = binToOct(address);
		for(var i in Dev.periphery){
			if(Dev.periphery[i].address == oct){
				return Dev.periphery[i].device;
			}
		}
		return false;
	}
	,update: function(){
		var device = this.getByAddress(Reg.pabr.get());
		if(device){
			device.update();
		}
	}
	,resetAll: function(){
		for(var i in Dev.periphery){
			Dev.periphery[i].device.reset();
		}
	}
	,periphery: [
		 new Device('020', OctalDisplay)
		,new Device('030', DotMatrix)
		,new Device('031', DotMatrix)
		,new Device('032', DotMatrix)
		,new Device('033', DotMatrix)
		,new Device('034', DotMatrix)
		,new Device('040', AsciiDisplay)
		,new Device('041', AsciiDisplay)
	]
}