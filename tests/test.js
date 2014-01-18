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
	
	this.callback;
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
	var result = this.functionToTest.apply(this, this.arguments);
	
	if (typeof this.callback === 'function')
		this.callback(result);
			
	return result;
};

test.prototype.test = function() {
	if (this.type === 'equal') {
		return this.equal(this.expected);
	} else if (this.type === 'range') {
		return this.inRange(this.expected);
	} else if (this.type === 'typeOf') {
		return this.ofType(this.expected);
	} else if (this.type === 'none') {
		this.run();
		return void(0);
	} else if (this.type === 'desc') {
		var result = this.run();
		console.log('TEST DESC - Expected "' + this.expected + '", and result was "' + format(result) + '".');
	}
};

test.prototype.inRange = function(range) {
	var value = this.run();
	if (value >= range.min && value <= range.max) {
		this.passMessage('Expected in range "' +  format(range) + '".');
		return true;
	} else {
		this.failMessage('Expected in range "' +  format(range) + '", however was "' +  format(value) + '".');
		return false;
	}
};

// Tests if the testing function returns the expected results
test.prototype.equal = function(expected) {
	var value = this.run();
	
	if (equal(value, expected)) {
		this.passMessage('Expected "' +  format(expected) + '".');
		return true;
	} else {
		this.failMessage('Expected "' +  format(expected) + '", however was "' +  format(value) + '".');
		return false;
	}
};

test.prototype.ofType = function(expected) {
	var value = typeof this.run();
	if (value === expected) {
		this.passMessage('Expected "' +  format(expected) + '".');
		return true;
	} else {
		this.failMessage('Expected "' + format(expected) + '", however was "' +  format(value) + '".');
		return false;
	}
};




