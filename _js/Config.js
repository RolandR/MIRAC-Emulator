/*
	Config for the emulator.
*/

var args = window.location.search;
/*if(args){
	seed = args.split("seed=")[1];
	if(seed){
		seed = seed.split("&")[0];
	}
	setRuggedness = args.split("ruggedness=")[1];
	if(setRuggedness){
		setRuggedness = setRuggedness.split("&")[0];
	}
	setIterations = args.split("iterations=")[1];
	if(setIterations){
		setIterations = setIterations.split("&")[0];
	}
}*/

console.log(args);

var Config = {
	 interval: 0
	,frequencyMeasuringFrequency: 1000 // Yeah, that's a good variable name - defines how often clock frequency is measured
	,useAnimations: true // Use css transitions for read/write highlight
	,sampleProgram: "bouncing_ball.midas" // Default program to be loaded to editor at startup, in ./samplePrograms/
}
