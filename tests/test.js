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
	}
};

test.prototype.inRange = function(range) {
	var value = this.run();
	if (value >= range.min && value <= range.max) {
		this.passMessage('Expected in range (min : ' + range.min + ', max : ' + range.max + ').');
		return true;
	} else {
		this.failMessage('Expected in range (min : ' + range.min + ', max : ' + range.max + '), however was "' + value + '".');
		return false;
	}
};

// Tests if the testing function returns the expected results
test.prototype.equal = function(expected) {
	var value = this.run();
	if (value === expected) {
		this.passMessage('Expected "' + expected + '".');
		return true;
	} else {
		this.failMessage('Expected "' + expected + '", however was "' + value + '".');
		return false;
	}
};




