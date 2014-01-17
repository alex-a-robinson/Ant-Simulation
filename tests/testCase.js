/**
* Test Case class
*/

var testCase = function(discription) {
	this.discription = discription;

	this.tests = [];
	
	this.passed = 0;
	this.failed = 0;
	this.numberOfTests = 0
};

testCase.prototype.createTest = function(functionToTest, arguments, type, expected, showPassMessage, showFailMessage) {
	showPassMessage = typeof showPassMessage !== 'undefined' ? showPassMessage : false;
	showFailMessage = typeof showFailMessage !== 'undefined' ? showFailMessage : true;
	
	var singleTest = new test(functionToTest, arguments)
	singleTest.showPassMessage = showPassMessage;
	singleTest.showFailMessage = showFailMessage;
	singleTest.type = type;
	singleTest.expected = expected;
	
	this.tests.push(singleTest);
	this.numberOfTests += 1;
	
	return singleTest;
};

testCase.prototype.testAll = function() {
	for (var i = 0; i < this.tests.length; i++) {
		var result = this.tests[i].test();
		
		if (result === true)
			this.passed += 1;
		else if (result === false)
			this.failed += 1;
	}
};

testCase.prototype.summery = function() {
	console.log(this.discription);
	console.log('    ' + this.passed + ' passed and ' + this.failed + ' failed of ' + this.numberOfTests + ' tests.');
};