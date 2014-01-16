/**
* Testing suite
*/

var test = function() {
	this.testingFunction;
	this.args;				// The arguments
};

test.prototype.equal = function(expected) {
	var value = this.testingFunction.apply(this, this.args);
	if (value === expected) {
		console.log('TEST PASSED - Expected "' + expected + '".');
		return true;
	} else {
		console.log('TEST FAILED - Expected "' + expected + '", however was "' + value + '".');
		return false;
	}
};