function getValue(id) {
	return document.getElementById(id).value;
}

function setValue(id, value) {
	document.getElementById(id).value = value;
}

function updateValue(prop, value, valueID) {
	CHARS[prop].value = value;
	var valueDOM = getDOM(valueID);
	valueDOM.innerHTML = value;
}

// Need to change the default in-built class name
function setDefaultInputs(obj) {
	var table = document.createElement('table');
	table.setAttribute('class', 'config');
	
	for (var prop in CHARS) {
		
		var characteristic = CHARS[prop];
		
		var row = document.createElement('tr');
		row.setAttribute('class', 'config');
		row.setAttribute('title', characteristic.desc);
		
		var label = document.createElement('td');
		label.setAttribute('class', 'config');
		//label.setAttribute('title', characteristic.desc);
		label.innerHTML = characteristic.neatName;
		
		var inputContainer = document.createElement('td');
		inputContainer.setAttribute('class', 'config');
		inputContainer.setAttribute('id', 'config-input-container');
		
		var input = document.createElement('input');
		input.setAttribute('class', 'config');
		input.setAttribute('type', 'range');
		input.setAttribute('id', characteristic.id);
		input.setAttribute('min', characteristic.min);
		input.setAttribute('max', characteristic.max);
		input.setAttribute('step', characteristic.step);
		//input.setAttribute('title', characteristic.desc);
		input.setAttribute('onchange', 'updateValue("' + prop + '", this.value, "' + characteristic.id + '-value");')	// <-- wont work in IE
		input.value = characteristic.defaultValue;
		
		var value = document.createElement('td');
		value.setAttribute('class', 'config');
		value.setAttribute('id', characteristic.id + '-value');		// append value to the end of the id
		value.innerHTML = characteristic.value;
		
		inputContainer.appendChild(input);
		row.appendChild(label);
		row.appendChild(inputContainer);
		row.appendChild(value);
		table.appendChild(row);
	}
	
	obj.appendChild(table);
}