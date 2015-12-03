/*
	Assembler for the MIDAS assembly language.
*/

var Assembler = new function(){
	
	function assemble(rawCode){
		/*
			A label points to a specific address in memory.
			In MIDAS code, a label can be once defined anywhere
			and referenced from anywhere. Labels are evaluated at
			compile time.
		*/
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
		
		// Remove comments and whitespace and resolve mnemonics to opcodes.
		while(i--){
			lines[i] = lines[i].split("//")[0];                 // remove comments
			lines[i] = lines[i].replace(/^\s+|\s+$/g, '');      // trim whitespace
			
			// Discard empty lines
			if(lines[i] == ""){
				lines.splice(i, 1);
				continue;
			}

			lines[i] = lines[i].replace(/\B' '\B/g, "'SPACE'"); // replace ' ' with 'SPACE', to avoid it being split(' ');
			lines[i] = lines[i].split(" ");
			var l = lines[i].length;
			while(l--){
				// Interpret purely alphabetic strings as mnemonics.
				// Translate them to opcodes.
				if(/^[a-z]+$/i.test(lines[i][l]) === true){	 // check if alphabetic
					if(lines[i][l].substring(0, 1) != "$"){
						var mnemonic = lines[i][l];
						lines[i][l] = Opcodes.mnemonicToOct(lines[i][l]);
						if(lines[i][l] == ""){
							error = true;
							errorMsg += "Assembler: Unknown instruction: "+mnemonic+" on line "+(Math.round(i)+1)+"\n";
						}
					}
				}
				
				// Values starting with # are binary.
				// Translate them to octal
				if(lines[i][l].substring(0, 1) == "#"){
					lines[i][l] = binToOct(lines[i][l].substring(1, lines[i][l].length));
				}

				// Values ending with . are decimal.
				// Translate them to octal
				if(lines[i][l].substring(lines[i][l].length-1, lines[i][l].length) == "."){
					lines[i][l] = decToOct(lines[i][l].substring(0, lines[i][l].length-1));
				}
				
				// Remove emtpy entries
				if(lines[i][l] == ""){
					lines[i].splice(l, 1);
					continue;
				}
				
				// Translate printable ascii chars (syntax: 'a')
				// to octal
				if(lines[i][l] === "'SPACE'"){ // first, revert placeholder 'SPACE'
					lines[i][l] = "' '";
				}
				
				if(/'[ -~]'/g.test(lines[i][l]) === true){
					var character = lines[i][l].charCodeAt(1);
					lines[i][l] = decToOct(character);
				}
			}
		}
		
		var instructions = [];
		var labels = [];
		
		var startingAddress = document.getElementById('loadToAddress').value;
		startingAddress = ("000" + startingAddress).slice(-3);
		startingAddress = Math.round(octToDec(startingAddress));
		
		// Evaluate label definitions
		for(var i in lines){
			for(var l in lines[i]){
				var ins = lines[i][l]
				if(ins.substring(0, 1) == "$" && ins.substring(ins.length - 1, ins.length) == ":"){
					labels.push(
						new Label(
							decToOct((instructions.length + startingAddress)/* % mem.getSize()*/)
							,ins.substring(0, ins.length - 1)
						)
					);
				} else {
					instructions.push(lines[i][l]);
				}
			}
		}
		
		// Evaluate label calls
		for(var i in instructions){
			if(instructions[i].substring(0, 1) == "$"){
				var foundLabel = false;
				for(var l in labels){
					if(labels[l].name == instructions[i]){
						instructions[i] = labels[l].address;
						foundLabel = true;
					}
				}
				if(!foundLabel){
					error = true;
					errorMsg += "Assembler: Could not resolve label: "+instructions[i]+"\n";
				}
			}
		}
		
		if(error){
			console.error(errorMsg);
		} else {
			return instructions;
		}
	}
	return{
		assemble: assemble
	}
}