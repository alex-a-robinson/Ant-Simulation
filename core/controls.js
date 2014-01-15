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
* Toggles RUNNING and updates the pause/run button
* @param {HTML element} button - The pause/run buttons HTML element 
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
	getElement(characteristic.id + '-value').innerHTML = value;
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
			
		updateValue(getElement(characteristic.id), value);
	}
}

/**
* Create a new HTML element
* @param {string} tag - A HTML tag name e.g. 'div'
* @param [{type : string, value : *}] attributes - A list of attributes to add to the new element
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
* @param {*} prop - The property of CHARS which the characteristic refers to
* @return {HTML element}
*/
function createInputType(characteristic, prop) {

	// Create the intial input tag
	var input = newElement('input', [
		{type : 'class', value : 'config'},
		{type : 'type', value : 'range'},
		{type : 'id', value : characteristic.id},
		{type : 'name', value : prop},
		{type : 'onchange', value : 'updateValue(this, this.value);'},
	]);
	
	if (!characteristic.editable)
		input.setAttribute('disabled', 'disabled');
	
	input.value = characteristic.defaultValue;
	
	// Depending on the type add extra attributes
	if (characteristic.inputType === INPUT_TYPE.slider) {
		input.setAttribute('min', characteristic.min);
		input.setAttribute('max', characteristic.max);
		input.setAttribute('step', characteristic.step);
		input.setAttribute('type', 'range');
	}
	
	return input;
}

/**
* Create a row containing a label, input and value elements used for creating dynamic inputs for characteristics
* @param {*} characteristic - A single characteristic from CHARS variable
* @param {string} prop - The property of CHARS which the characteristic refers to
* @return {HTML element}
*/
function createInput(characteristic, prop) {
	// Row
	var row = newElement('tr', [{type : 'class', value : 'config'}, {type : 'title', value : characteristic.desc}]);
	
	// Label element
	var label = newElement('td', [{type : 'class', value : 'config'}]);
	label.innerHTML = characteristic.neatName;
	
	// Input and container elements
	var inputContainer = newElement('td', [{type : 'class', value : 'config'}, {type : 'id', value : 'input-container'}]);
	var input = createInputType(characteristic, prop);
	
	// Value element
	var value = newElement('td', [{type : 'class', value : 'config'}, {type : 'id', value : characteristic.id + '-value'}]);	// Append '-value' to the id of the elements which show the characteristics value
	if (characteristic.type === VALUE_TYPE.floatValue)
		value.innerHTML = characteristic.value.toFixed(NUMBER_OF_FIXED_PLACES); 
	else
		value.innerHTML = characteristic.value;
	
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
		var inputRow = createInput(CHARS[prop], prop)
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

/**
* Create a row containing a label and data elements used for displaying information about species
* @param {string} className - The name of the class for the species
* @param {string} id - The ID which will be used to access and update the species
* @param {string} labelValue - The text which will be used as a label for the data
* @param {string} dataValue - The data which will be displayed
* @return {HTML element}
*/
function createDataRow(className, id, labelValue, dataValue) {
	var row = newElement('tr', [{type : 'class', value : className}]);
	
	var label = newElement('td', [{type : 'class', value : className}]);
	label.innerHTML =  labelValue;
	
	var data = newElement('td', [{type : 'class', value : className}, {type : 'id', value : id + '-data'}]);	// Always append '-data' so can be eddied later
	data.innerHTML = dataValue;
	
	row.appendChild(label);
	row.appendChild(data);
	return row;
}

/**
* Create a row containing a label and data elements used for displaying information about species
* @param {species object} species - The species whose data you want to create a data display for
*/
function createSpeciesData(species) {
	
	var id = species.id;
	var className = 'species' + ' ' + id;
	
	// Create a new table element which will contain all other elements
	var table = newElement('table', [{type : 'class', value : className}]);
	
	// Create a new row for the title and visibility button
	var titleRow = newElement('tr', [{type : 'class', value : className}, {type : 'id', value : id + '-label-row'}]);	// Given a specific ID so does not turn invisible when visibility is toggled
	
	var title = newElement('td', [{type : 'class', value : className}, {type : 'onclick', value : 'select(this)'}]);
	title.innerHTML = 'Species: ' + id;
	
	var toggleVisibility = newElement('td', [{type : 'class', value : className + ' toggleVisibility'}, {type : 'onclick', value : 'toggleClassVisibility(this)'}]);
	toggleVisibility.innerHTML = '-';	// Default expanded
	
	// Create a data row for colour
	var colourRow = createDataRow(className, id + '-colour', 'colour', '');
	colourRow.childNodes[1].style.backgroundColor = species.colour.nest;
	
	// Create a data row for number of ants
	var antNumRow = createDataRow(className, id + '-antNum', 'Number of ants', species.ants.length);
	
	// Create a data row for amount of food
	var foodAmount = 0;
	for (var i = 0; i < species.nests.length; i++)
		foodAmount += species.nests[i].health;
	var foodAmountRow = createDataRow(className, id + '-foodAmount', 'Amount of food', foodAmount);
	
	// Append all of the rows to the table
	titleRow.appendChild(title);
	titleRow.appendChild(toggleVisibility);
	
	table.appendChild(titleRow);
	table.appendChild(colourRow);
	table.appendChild(antNumRow);
	table.appendChild(foodAmountRow);
	
	// Append the table to the data panel
	getElement('data').appendChild(table);
}

/**
* Updates data for all of the species currently in the simulation
*/
function updateSpeciesData() {
	for (var i = 0; i < SPECIES_LIST.length; i++) {
		var species = SPECIES_LIST[i];
		
		var id = species.id;
		
		// Update the species colour
		var colourDataElement = getElement(id + '-colour-data');
		colourDataElement.style.backgroundColour = species.colour.nest;
		
		// Update the number of Ants
		var antNumDataElement = getElement(id + '-antNum-data');
		antNumDataElement.innerHTML = species.ants.length;
		
		// Update the amount of food
		var foodAmountDataElement = getElement(id + '-foodAmount-data');
		
		var foodAmount = 0;
		for (var k = 0; k < species.nests.length; k++)
			foodAmount += species.nests[k].health;
	
		foodAmountDataElement.innerHTML = foodAmount.toFixed(NUMBER_OF_FIXED_PLACES);
	}
}

/**
* Checks whether the species data is currently maximised or minimised and returns 
* whether or not the species data should be hidden or not assuming the button has
* been clicked
* @param {HTML element} button - A reference to the toggle visibility button
* @return {string} - The value of the display styling
*/
function nextVisibility(button) {
	if (button.innerHTML === '+')
		return 'table-row';		// Show the element
	else
		return 'none';		// Hide the element
}

/**
* Toggles the text in the visibility button
* @param {HTML element} button - A reference to the toggle visibility button
*/
function toggleVisibilityButton(button) {
	if (button.innerHTML === '-')
		button.innerHTML = '+';
	else
		button.innerHTML = '-';
}

/**
* Maximises and Minimises the data for a particular species
* @param {HTML element} button - A reference to the toggle visibility button
*/
function toggleClassVisibility(button) {
	var id = button.className.split(' ')[1];	// The second class name is the species id
	
	var listOfClassElements = document.getElementsByClassName(id)[0].getElementsByTagName('TR');	// Get all other elements with the same class name i.e. all elements relating to that species data
	
	// For each element in the list
	for (var i = 0; i < listOfClassElements.length; i++) {
				
		// Check if its a row and also check if its not the row containing the visibility button (so as not to hide the button from being used afterwards) 
		if (listOfClassElements[i].id !== id + '-label-row') {
			listOfClassElements[i].style.display = nextVisibility(button);	// Then hide/show the element
		}	
	}
	
	// Finally toggle the button to show the next symbol i.e. + or -
	toggleVisibilityButton(button);
}

/**
* Selects a new species allowing the user to alter that species characteristics
* @param {HTML element} title - A reference to the title element of the species data
*/
function select(title) {
	// De colour previous selected table
	document.getElementsByClassName(SELECTED_SPECIES.id)[0].style.backgroundColor = UNSELECTED_COLOUR;

	// Update new selected table
	var id = title.className.split(' ')[1];		// The second class name is the species id
	document.getElementsByClassName(id)[0].style.backgroundColor = SELECTED_COLOUR;
	
	// Find the species which the id refers to and set the selected species to it
	for (var s in SPECIES_LIST) {
		var species = SPECIES_LIST[s];
		if (species.id === parseInt(id)) {
			SELECTED_SPECIES = species;
		}
	}
	
	// Update the characteristics in the config panel to the characteristics of the selected species
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		updateValue(getElement(characteristic.id), SELECTED_SPECIES.chars[prop]);
	}
}
		