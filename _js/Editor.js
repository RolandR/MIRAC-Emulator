/*
	A text editor with syntax highlighting for the MIDAS assembly language.
*/

function Editor(
	div				// Div where syntax highlighted text will be displayed
	,textArea		// TextArea for input
){
	var oldContent = textArea.textContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
	var selectionOffset = 0;
	var selectionLength = 0;
	
	function init(){
		var newContent = textArea.textContent;
		newContent = newContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
		
		var i = newContent.length;
		while(i--){
			updateLine(i, newContent[i]);
		}			
	}
	
	function onEdit(){
		var newContent = textArea.textContent;
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
		
		oldContent = textArea.textContent.replace(/\<br( \/)?\>/g, "\n").split("\n");
		
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