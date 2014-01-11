function start() {
	RUNNING = true;
}

function pause() {
	RUNNING = false;
}

function toggleRunning() {
	if (RUNNING)
		pause();
	else
		start();
}

/**
* Steps through a single tick
*/
function step() {
	start();
	tick();
	pause();
}

/**
* Toggles RUNNING and updates the puase/run button
* @param {obj} button - The button element 
*/
function runPauseButton(button) {
	toggleRunning();
	if (RUNNING)
		button.innerHTML = 'pause';
	else
		button.innerHTML = 'run';
}

/**
* Updates the value of a characteristic
* @param {HTML element} element - An element of a input in the settings panel
* @param {*} value - The new value of the characteristic
*/
function updateValue(element, value) {
	// Update the button colour to show an update needs to be pushed to the species
	getElement('button-update').style.color = BUTTON_UPDATE_COLOUR;
	
	// Get the characteristic the element referees to and set its to the new value
	var characteristic = CHARS[element.name];
	characteristic.value = value;
	
	if (characteristic.type === VALUE_TYPE.floatValue)
		value = parseFloat(value).toFixed(NUMBER_OF_FIXED_PLACES);
	
	// Update the characteristics value in settings as well as the input 
	setInnerHTML(getElement(characteristic.id + '-value'), value);
	setValue(characteristic.id, value);
}

/**
* Updates the value of all characteristics to their default values
*/
function updateDefaultValues() {
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		updateValue(getElement(characteristic.id), characteristic.defaultValue);
	}
}

/**
* Updates the value of all characteristics a random value
*/
function updateRandomValues() {
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		
		if (!characteristic.editable)
			continue;
			
		if (characteristic.type ===  VALUE_TYPE.floatValue)		// If characteristic requires a float must use randFloat
			var value = randFloat(characteristic);
		else if (characteristic.type ===  VALUE_TYPE.integerValue) 	// If characteristic requires a integer must use randInt
			var value = randInt(characteristic);
			
		updateValue(getDOM(characteristic.id), value);
	}
}

/**
* Create a new HTML element
* @param {string} tag - A HTML tag name e.g. 'div'
* @param [{type : {string}, value : {*}}] attributes - A list of attributes to add to the new element
* @return {HTML element}
*/
function newElement(tag, attributes) {
	var element = document.createElement(tag);
	for (var i = 0; i < attributes.length; i++)
		element.setAttribute(attributes[i].type, attributes[i].value);
	return element;
}

/**
* Create an input element of type [range, button, colour]
* @param {*} characteristic - A single characteristic from CHARS variable
* @return {HTML element}
*/
function createInputType(characteristic) {

	// Create the intial input tag
	var input = newElement('input', [
		{type : 'class', value : 'config'},
		{type : 'type', value : 'range'},
		{type : 'id', value : 'characteristic.id)'},
		{type : 'name', value : 'prop'},
		{type : 'onchange', value : 'updateValue(this, this.value);'},
	]);
	
	if (!characteristic.editable)
		input.setAttribute('disabled', 'disabled');
	
	input.value = characteristic.defaultValue;
	
	// Depending on the type add extra attributes
	if (characteristic.inputType === INPUT_TYPE.slider) {
		input.setAttribute('min', 'characteristic.min');
		input.setAttribute('max', 'characteristic.max');
		input.setAttribute('step', 'characteristic.step');
		input.setAttribute('type', 'range');
	}
	
	return input;
}

/**
* Create a row containing a label, input and value elements used for creating dynamic inputs for characteristics
* @param {*} characteristic - A single characteristic from CHARS variable
* @return {HTML element}
*/
function createInput(characteristic) {
	// Row
	var row = newElement('tr', [{type : 'class', value : 'config'}, {type : 'title', value : characteristic.desc}]);
	
	// Label element
	var label = newElement('td', [{type : 'class', value : 'config'}]);
	setInnerHTML(label, characteristic.neatName);
	
	// Input and container elements
	var inputContainer = newElement('td', [{type : 'class', value : 'config'}, {type : 'id', value : 'input-container'}]);
	var input = createInputType(characteristic);
	
	// Value element
	var value = newElement('td', [{type : 'class', value : 'config'}, {type : 'id', value : characteristic.id + '-value'}]);	// Append '-value' to the id of the elements which show the characteristics value
	if (characteristic.type === VALUE_TYPE.floatValue)
		setInnerHTML(value, characteristic.value.toFixed(NUMBER_OF_FIXED_PLACES)); 
	else
		setInnerHTML(value, characteristic.value);
	
	// Add all the individual elements to the row
	inputContainer.appendChild(input);
	row.appendChild(label);
	row.appendChild(inputContainer);
	row.appendChild(value);
	
	return row;
}

/**
* Creates inputs for all characteristics used for creating dynamic inputs for characteristics
* And appends them to a table in the config panel
*/
function createCharacteristicInputs() {
	var configPanel = getElement('config');
	var table = newElement('table', {type : 'class', value : 'config'});
	
	for (var prop in CHARS) {		
		var inputRow = createInput(CHARS[prop])
		table.appendChild(inputRow);
	}
	
	configPanel.appendChild(table);
}

/**
* Updates the selected species with the new values selected in the config panel
*/
function updateUserSpecies() {
	// Return the button to its original colour showing no pending updates need to be pushed to the species
	getElement('button-update').style.color = BUTTON_NO_UPDATE_COLOUR;
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		
		// Parse the input to make sure its in the correct format
		if (characteristic.type === VALUE_TYPE.floatValue)
			var value = parseFloat(characteristic.value);
		else if (characteristic.type === VALUE_TYPE.integerValue)
			var value = parseInt(characteristic.value);
		
		// Update the selected species characteristics to this new value
		SELECTED_SPECIES.chars[prop] = value;
	}
}

function createDataRow(className, id, labelValue, dataValue) {
	var row = newElement('tr', [{type : 'class', value : className}]);
	
	var label = newElement('tr', [{type : 'class', value : className}]);
	setInnnerHTML(label, labelValue);
	
	var data = newElement('tr', [{type : 'class', value : className}, {type : 'id', value : id + '-data'}]);
	setInnnerHTML(data, dataValue);
	
	row.appendChild(label);
	row.appendChild(data);
	return row;
}

function createSpeciesData(species) {
	
	var className = 'species' + ' ' + ID;
	
	// Create a new table element which will contain all other elements
	var table = newElement('table', [{type : 'class', value : className}]);
	
	// Create a new row for the title and visibility button
	var titleRow = newElement('tr', [{type : 'class', value : className}, {type : 'id', value : ID + '-label-row'}]);	// Given a specific ID so does not turn invisible when visibility is toggled
	
	var title = newElement('td', [{type : 'class', value : className}, {type : 'onclick', value : 'select(this)'}]);
	setInnerHTML(title, 'Species: ' + ID);
	
	var toggleVisibility = newElement('td', [{type : 'class', value : className + ' toggleVisibility'}, {type : 'onclick', value : ;'updateClassVisibility(this)'}]);
	setInnerHTML(title, '-');	// Default expanded
}


function newSpeciesData(species) {
	var dataPanel = getElement('data');
	
	var ID = species.id;
	var className = 'species ' + ID;	// two classes
	
	// open/close icon
	var toggleVisibility = document.createElement('td');
	toggleVisibility.setAttribute('class', className + ' toggleVisibility');
	toggleVisibility.setAttribute('id', ID + '-toggleVisibility');
	toggleVisibility.innerHTML = '-'
	toggleVisibility.setAttribute('onclick', 'updateClassVisibility(this)');
	
	// title
	var title = document.createElement('td');
	title.setAttribute('class', className);
	title.setAttribute('id', ID + '-label');
	title.innerHTML = 'Species ID: ' + species.id;
	title.setAttribute('onclick', 'select(this)');
	
	// titleRow
	var rowLabel = document.createElement('tr');
	rowLabel.setAttribute('class', className);
	rowLabel.setAttribute('id', ID + '-label-row');
	//rowLabel.setAttribute('onclick', 'updateClassVisibility(this)');
	
	rowLabel.appendChild(title);		
	rowLabel.appendChild(toggleVisibility);	
	
	// colour
	
	var colorRow = document.createElement('tr');
	colorRow.setAttribute('class', className);
	
	var colorLabel = document.createElement('td');
	colorLabel.setAttribute('class', className);
	colorLabel.innerHTML = 'Colour'
	
	var colorData = document.createElement('td');
	colorData.setAttribute('class', className);
	colorData.setAttribute('id', ID + '-color-data');
	colorData.style.backgroundColor = species.colour.nest;
	
	colorRow.appendChild(colorLabel);
	colorRow.appendChild(colorData);
	
	// number of ants
	
	var antNumRow = document.createElement('tr');
	antNumRow.setAttribute('class', className);
	
	var antNumLabel = document.createElement('td');
	antNumLabel.setAttribute('class', className);
	antNumLabel.innerHTML = 'Ant Number'
	
	var antNumData = document.createElement('td');
	antNumData.setAttribute('class', className);
	antNumData.setAttribute('id', ID + '-antNum-data');
	antNumData.innerHTML = species.ants.length;
	
	antNumRow.appendChild(antNumLabel);
	antNumRow.appendChild(antNumData);
	
	// Food amount
	
	var foodAmountRow = document.createElement('tr');
	foodAmountRow.setAttribute('class', className);
	
	var foodAmountLabel = document.createElement('td');
	foodAmountLabel.setAttribute('class', className);
	foodAmountLabel.innerHTML = 'Nest Food'
	
	var foodAmountData = document.createElement('td');
	foodAmountData.setAttribute('class', className);
	foodAmountData.setAttribute('id', ID + '-foodAmount-data');
	
	var foodAmount = 0;
	for (var i = 0; i < species.nests.length; i++)
		foodAmount += species.nests[i].health;
	
	foodAmountData.innerHTML = foodAmount;
	
	foodAmountRow.appendChild(foodAmountLabel);
	foodAmountRow.appendChild(foodAmountData);
	
	// table
	
	var table = document.createElement('table');
	table.setAttribute('class', className);
	
	table.appendChild(rowLabel);
	table.appendChild(colorRow);
	table.appendChild(antNumRow);
	table.appendChild(foodAmountRow);
	
	// row
	
	var row = document.createElement('tr');
	
	row.appendChild(table);
	dataPanel.appendChild(row);
	
}

function updateSpeciesData() {
	for (var i = 0; i < SPECIES_LIST.length; i++) {
		var species = SPECIES_LIST[i];
		
		var baseID = '' + species.id;
		
		// Colour
		var colourDataDOM = getDOM(baseID + '-color-data');
		colourDataDOM.style.backgroundColour = species.colour.nest;
		
		// Number of Ants
		var antNumDataDOM = getDOM(baseID + '-antNum-data');
		antNumDataDOM.innerHTML = species.ants.length;
		
		// Food Amount
		var foodAmountDataDOM = getDOM(baseID + '-foodAmount-data');
		
		var foodAmount = 0;
		for (var i = 0; i < species.nests.length; i++)
			foodAmount += species.nests[i].health;
	
		foodAmountDataDOM.innerHTML = foodAmount.toFixed(NUMBER_OF_FIXED_PLACES);
	}
}

function updateClassVisibility(obj) {

	var className = (obj.className);
		
	var genericClass = className.split(' ')[0];
	var specificClass = className.split(' ')[1];
	
	var DOM = document.getElementsByClassName(specificClass);

	var display;
	if (obj.innerHTML === '+') {
		obj.innerHTML = '-';
		display = 'table-row';
	} else {
		obj.innerHTML = '+';
		display = 'none';
	}
	
	for (var i = 0; i < DOM.length; i++) {
		if (DOM[i].tagName === 'TR' && DOM[i].className.split(' ')[1] === specificClass && (DOM[i].id !== specificClass + '-label' && DOM[i].id !== specificClass + '-toggleVisibility' && DOM[i].id !== specificClass + '-label-row')) {
			DOM[i].style.display = display;
		}	
	}
}

function select(obj) {
	// De colour previous selected table
	var DOM = document.getElementsByClassName(SELECTED_SPECIES.id);
	for (var i = 0; i < DOM.length; i++) {
		if (DOM[i].tagName === 'TABLE')
			DOM[i].style.backgroundColor = '#FFFFFF';
	}

	// Update new selected table
	var className = (obj.className);
	var genericClass = className.split(' ')[0];
	var specificClass = className.split(' ')[1];
	var DOM = document.getElementsByClassName(specificClass);
	
	for (var i = 0; i < DOM.length; i++) {
		if (DOM[i].tagName === 'TABLE')
			DOM[i].style.backgroundColor = SELECTED_COLOUR;
	}

	for (var s in SPECIES_LIST) {
		var species = SPECIES_LIST[s];
		if (species.id === parseInt(specificClass)) {
			SELECTED_SPECIES = species;
		}
	}
	
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		updateValue(getDOM(characteristic.id), SELECTED_SPECIES.chars[prop]);
	}
}
		