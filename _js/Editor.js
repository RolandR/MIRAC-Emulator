/*
	A text editor with syntax highlighting for the MIDAS assembly language.
*/

function Editor(
	 displayElement		// Element where syntax highlighted text will be displayed
	,inputElement		// Element for input, placed over displayElement
){
	var oldContent = inputElement.textContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
	var selectionOffset = 0;
	var selectionLength = 0;
	
	function init(){
		var newContent = inputElement.textContent;
		newContent = newContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
		
		var i = newContent.length;
		while(i--){
			updateLine(i, newContent[i]);
		}
	}
	
	function onEdit(){
		var newContent = inputElement.textContent;
		newContent = newContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
		
		var i = newContent.length;
		if(oldContent.length == newContent.length){
			while(i--){
				if(oldContent[i] !== newContent[i]){
					updateLine(i, newContent[i]);
				}
			}
		} else {
			while(i--){
				updateLine(i, newContent[i]);
			}
		}
		
		oldContent = inputElement.textContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
		
	}
	
	function onScroll(){
		displayElement.scrollTop = inputElement.scrollTop;
	}
	
	function updateLine(lineNr, line){
		
		code = line.split("//")[0];
		comment = line.substring(code.length, line.length);
		if(comment.length > 0){
			comment = '<span class="e-comment">'+comment+"</span>";
		}
		
		code = code.split(" ");
		var c = code.length;
		while(c--){
			var fragment = code[c];
			if(/^([a-z]*)$/i.test(fragment) === true && fragment.length > 0){	 // check if alphabetic
				var oct;
				oct = Opcodes.mnemonicToOct(fragment);
				if(oct == ""){	// Invalid instruction
					code[c] = '<span class="e-invalid-instruction" title="Invalid instruction">'+fragment+"</span>";
				} else {		// Valid instruction
					code[c] = '<span class="e-valid-instruction" title="Opcode '+oct+'">'+fragment+"</span>";
				}
			} else if(fragment.substring(0, 1) == "$"){	// Label
				if(fragment.substring(fragment.length-1, fragment.length) == ":"){	// Label definition
					code[c] = '<span class="e-define-label">'+fragment+"</span>";
				} else {	// Label call
					code[c] = '<span class="e-label">'+fragment+"</span>";
				}
			} else if(fragment.substring(0, 1) == "#"){	// Binary value
				code[c] = '<span class="e-binary" title="Octal: '+binToOct(fragment)+'">'+fragment+"</span>";
			} else if(/^([0-7]*)$/.test(fragment) === true && fragment.length > 0){	// Octal value
				code[c] = '<span class="e-octal" title="Binary: '+octToBin(fragment)+'">'+fragment+"</span>";
			}
		}
		
		code = code.join();
		
		var newLine = code + comment;
		newLine = '<div class="e-line">'+newLine+'</div><!---->';
		var content = displayElement.innerHTML.split("<!---->");
		if(content.length < lineNr){
			for(var i = 0; i <= lineNr; i++){
				if(content[i] == null || typeof(content[i] == undefined)){
					content[i] = '<div class="e-line"></div><!---->';
				}
			}
		}
		content[lineNr] = newLine;
		content = content.join("");
		console.log(content);
		displayElement.innerHTML = content;
	}
	
	inputElement.addEventListener('keydown',function(e) {
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
