/**
* A Single test to be used within a test case
*/
var test = function(functionToTest, arguments) {
	this.functionToTest = functionToTest;
	this.arguments = arguments;
	this.showPassMessage = false;
	this.showFailMessage = true;
	this.expected;
	this.type;	// 'equal' for an equality test or 'range' for a range check 
};

test.prototype.passMessage = function(msg) {
	if (this.showPassMessage)
		console.log('TEST PASSED - ' + msg);
};


test.prototype.failMessage = function(msg) {
	if (this.showFailMessage)
		console.log('TEST FAILED - ' + msg);
};

// Returns the value of the testing function run with specific args
test.prototype.run = function() {
	return this.functionToTest.apply(this, this.arguments);
};

test.prototype.test = function() {
	if (this.type === 'equal') {
		return this.equal(this.expected);
	} else if (this.type === 'range') {
		return this.inRange(this.expected);
	} else if (this.type === 'typeOf') {
		return this.ofType(this.expected);
	}
};

test.prototype.inRange = function(range) {
	var value = this.run();
	if (value >= range.min && value <= range.max) {
		this.passMessage('Expected in range "' +  this.format(range) + '".');
		return true;
	} else {
		this.failMessage('Expected in range "' +  this.format(range) + '", however was "' +  this.format(value) + '".');
		return false;
	}
};

// Tests if the testing function returns the expected results
test.prototype.equal = function(expected) {
	var value = this.run();
	
	if (equal(value, expected)) {
		this.passMessage('Expected "' +  this.format(expected) + '".');
		return true;
	} else {
		this.failMessage('Expected "' +  this.format(expected) + '", however was "' +  this.format(value) + '".');
		return false;
	}
};

test.prototype.ofType = function(expected) {
	var value = typeof this.run();
	if (value === expected) {
		this.passMessage('Expected "' +  this.format(expected) + '".');
		return true;
	} else {
		this.failMessage('Expected "' + this.format(expected) + '", however was "' +  this.format(value) + '".');
		return false;
	}
};

test.prototype.format = function(value) {
	if (typeof value === 'object') {
		str = '{';
		for (prop in value) {
			str += prop + ' : ' + value[prop] + ', '
		}
		if (str[str.length - 2] === ',')
			str = str.substr(0, str.length-2);
		str += '}';
		return str;
	} else {
		return value;
	}
};





