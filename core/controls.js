var BUTTONS = {
	reset : updateDefaultValues,
	random : updateRandomValues,
	run : runPauseButton,
	update : updateUserSpecies,
	step : alert,
	restart : restart
};

function restart() {
	ANTS_LIST = [];
	CURRENT_ID = 0;
	SPECIES_LIST = [];
	RUNNING = true;
	
	// Create empty map
	createMap();
	
	// Create food system
	FOOD = new FoodSystem();
	FOOD.ctx = canvasCTX;
	FOOD.addRandFood({x: 40, y: 40}, 5);
	//FOOD.addRandFood({x: 140, y: 140}, 25);
	//FOOD.addRandFood({x: 20, y: 80}, 15);
	//FOOD.addRandFood({x: 230, y: 80}, 20);
	
	// Create a species
	USER_SPECIES = new Species(genID());
	USER_SPECIES.chars.speed = 0.4;
	USER_SPECIES.chars.eyesight = 5;
	USER_SPECIES.chars.eyeAngle = Math.PI/2;	// only seems to work for pi i.e. 180 degs
	USER_SPECIES.chars.pheromoneConcentration = 0.4;
	USER_SPECIES.chars.antennaSize = 5;
	USER_SPECIES.chars.antennaAngle = Math.PI/2;
	USER_SPECIES.colour = {
		worker : '#1C1C1C',
		soldier : '#1C1C1C',
		queen : '#00FF00',
		nest : '#555555',
		pheromone : '#E8E5A3',
	};	
	
	SPECIES_LIST.push(USER_SPECIES);
	newSpecies(getDOM('data'), USER_SPECIES);
	
	// Add ants
	for (var i = 0; i < DEBUG_ANT_NUM; i++) {
		var x = randInt({min : 0, max : GRID_SIZE.x - 1});	// -1 as randInt is inclusive
		var y = randInt({min : 0, max : GRID_SIZE.y - 1});
		var a = new Queen(genID(), {x : x, y : y});
		a.addToMap();
		a.species = USER_SPECIES;
		a.colour = USER_SPECIES.colour.worker;
		ANTS_LIST.push(a);
		a.sayHello();
	}
}

function start() {
	RUNNING = true;
}

function pause() {
	RUNNING = false;
}

function runPauseButton(button) {
	toggleRunning();
	if (RUNNING)
		button.innerHTML = 'pause';
	else
		button.innerHTML = 'run';
}

function toggleRunning() {
	if (RUNNING)
		RUNNING = false;
	else
		RUNNING = true;
}

function getValue(id) {
	return document.getElementById(id).value;
}

function setValue(id, value) {
	document.getElementById(id).value = value;
}

function setHTML(id, html) {
	document.getElementById(id).innerHTML = html;
}

function updateValue(dom, value) {
	getDOM('button-update').style.color = '#FF0000';
	var characteristic = CHARS[dom.name];
	characteristic.value = value;
	setHTML(characteristic.id + '-value', value);
	setValue(characteristic.id, value);
}

function updateDefaultValues() {
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		updateValue(getDOM(characteristic.id), characteristic.defaultValue);
	}
}

function updateRandomValues() {
	for (var prop in CHARS) {
		var characteristic = CHARS[prop];
		var value;
		if (characteristic.type ===  VALUE_TYPE.floatValue)
			value = randFloat(characteristic).toFixed(2);
		else if (characteristic.type ===  VALUE_TYPE.integerValue)
			value = randInt(characteristic);
			
		updateValue(getDOM(characteristic.id), value);
	}
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
		label.innerHTML = characteristic.neatName;
		
		var inputContainer = document.createElement('td');
		inputContainer.setAttribute('class', 'config');
		inputContainer.setAttribute('id', 'config-input-container');
		
		var input = document.createElement('input');
		input.setAttribute('class', 'config');
		input.setAttribute('type', 'range');
		input.setAttribute('id', characteristic.id);
		input.setAttribute('name', prop);
		input.setAttribute('min', characteristic.min);
		input.setAttribute('max', characteristic.max);
		input.setAttribute('step', characteristic.step);
		input.setAttribute('onchange', 'updateValue(this, this.value);')	// <-- wont work in IE
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

function updateUserSpecies() {
	getDOM('button-update').style.color = '#000000';
	for (var prop in CHARS) {
		var value;
		var characteristic = CHARS[prop];
		
		if (characteristic.type = VALUE_TYPE.floatValue)
			value = parseFloat(characteristic.value);
		else if (characteristic.type = VALUE_TYPE.integerValue)
			value = parseInt(characteristic.value);
			
		USER_SPECIES.chars[prop] = value;
	}
}

function newSpecies(obj, species) {
	
	var ID = ''+species.id;
	var className = 'species ' + ID;	// two classes
	
	// title
	var rowLabel = document.createElement('tr');
	rowLabel.setAttribute('class', className);
	rowLabel.setAttribute('id', ID + '-label');
	rowLabel.innerHTML = 'Species ID: ' + species.id;
	rowLabel.setAttribute('onclick', 'updateClassVisibility(this)');		// unsafe
	
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
	obj.appendChild(row);
	
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
	
		foodAmountDataDOM.innerHTML = foodAmount;
	}
}

function updateClassVisibility(obj) {

	var className = (obj.className);
		
	var genericClass = className.split(' ')[0];
	var specificClass = className.split(' ')[1];
	
	var DOM = document.getElementsByClassName(specificClass);
	
	for (var i = 0; i < DOM.length; i++) {
		if (DOM[i].tagName === 'TR' && DOM[i].className.split(' ')[1] === specificClass && DOM[i].id !== specificClass + '-label') {

			if (DOM[i].style.display !== 'none')
				DOM[i].style.display = 'none';
			else 
				DOM[i].style.display = 'table-row';
		}
			
	}
}
		