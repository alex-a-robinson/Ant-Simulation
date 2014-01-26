/**
* Test Case class
*/

var testCase = function(discription) {
	this.discription = discription;

	this.tests = [];
	
	this.passed = 0;
	this.failed = 0;
	this.numberOfTests = 0
	
	this.callback;
	this.callbackArgs = [];
	
	this.evaluateTo = true;
	
	this.callwith = void(0);
	
	this.autorun = false;
	
	this.descs = [];
	this.passMessages = [];
	this.failMessages = [];
};

testCase.prototype.createTest = function(functionToTest, arguments, type, expected, showPassMessage, showFailMessage) {
	showPassMessage = typeof showPassMessage !== 'undefined' ? showPassMessage : true;
	showFailMessage = typeof showFailMessage !== 'undefined' ? showFailMessage : true;
	
	var singleTest = new test(functionToTest, arguments)
	singleTest.showPassMessage = showPassMessage;
	singleTest.showFailMessage = showFailMessage;
	singleTest.type = type;
	singleTest.expected = expected;
	singleTest.callwith = this.callwith;
	
	if (typeof this.callback === 'function') {
		singleTest.callback = this.callback;
		singleTest.callbackArgs = this.callbackArgs;
	}
	
	singleTest.evaluateTo = this.evaluateTo;
	
	this.tests.push(singleTest);
	this.numberOfTests += 1;
	
	if (this.autorun) {
		var result = singleTest.test();
		this.parseResult(result);
	}
	
	return singleTest;
};

testCase.prototype.quickTest = function(functionToTest, arguments, type, expected, showPassMessage, showFailMessage) {
	showPassMessage = typeof showPassMessage !== 'undefined' ? showPassMessage : false;
	showFailMessage = typeof showFailMessage !== 'undefined' ? showFailMessage : true;
	
	var test = this.createTest(functionToTest, arguments, type, expected, showPassMessage, showFailMessage, callback);
	var result = test.test();
	this.parseResult(result);
	this.summery();
};

testCase.prototype.parseResult = function(result) {
	if (result[0] === true) {
		this.passed += 1;
		this.passMessages.push(result[1]);
	} else if (result[0] === false) {
		this.failed += 1;
		this.failMessages.push(result[1]);
	} else if (result[0] === 'desc') {	// A description of the result
		this.descs.push(result[1]);
	}
};

testCase.prototype.testAll = function() {
	for (var i = 0; i < this.tests.length; i++) {
		var result = this.tests[i].test();
		this.parseResult(result);
	}
};

testCase.prototype.summery = function() {
	if (this.failMessages.length > 0 || this.descs.length > 0)
		console.group(this.discription);
	else
		console.groupCollapsed(this.discription);
	for (var i = 0; i < this.descs.length; i++)
		console.log('%c' + this.descs[i], 'color: orange');
	for (var i = 0; i < this.passMessages.length; i++) {
		if (this.passMessages[i]  !== '')
			console.log('%c' + this.passMessages[i], 'color: green');
	}
	for (var i = 0; i < this.failMessages.length; i++) {
		if (this.failMessages[i]  !== '')
			console.log('%c' + this.failMessages[i], 'color: red');		
	}
	console.log('%c' + this.passed + ' passed and ' + this.failed + ' failed of ' + this.numberOfTests + ' tests.', 'font-weight:bold');
	console.groupEnd();
};