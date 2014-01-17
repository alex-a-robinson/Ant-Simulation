// ---------- randInt ----------

/**
* Test case - Test randInt returns a value within a specific range
* Test data - {min : 0, max : 100}
* Test data - {min : 0, max : 0}
* Test data - {min : -100, max : 0}
* Test data - {min : 20, max : 40}
* Test data - {min : -20, max : 20}
* Test data - {min : 0, max : 1}
*/

var randIntTest = new testCase();

randIntTest.createTest(randInt, [{min : 0, max : 100}], 'range', {min : 0, max : 100});
randIntTest.createTest(randInt, [{min : 0, max : 0}], 'range', {min : 0, max : 0});
randIntTest.createTest(randInt, [{min : -100, max : 0}], 'range', {min : -100, max : 0});
randIntTest.createTest(randInt, [{min : 20, max : 40}], 'range', {min : 20, max : 40});
randIntTest.createTest(randInt, [{min : -20, max : 20}], 'range', {min : -20, max : 20});
randIntTest.createTest(randInt, [{min : 0, max : 1}], 'range', {min : 0, max : 1});

var numOfRuns = 1000;	// The number of runs of the function to test the range

for (var i = 0; i < numOfRuns; i++) {
	randIntTest.testAll();
}

randIntTest.summery();

// ---------- randFloat ----------

/**
* Test case - Test randFloat returns a value within a specific range
* Test data - {min : 0, max : 2}
* Test data - {min : 0, max : 0}
* Test data - {min : -2, max : 0}
* Test data - {min : 1, max : 2}
* Test data - {min : -1, max : 1}
* Test data - {min : 0, max : 0.1}
* Test data - {min : -0.1, max : 0.1}
*/

var randFloatTest = new testCase();

randFloatTest.createTest(randFloat, [{min : 0, max : 2}], 'range', {min : 0, max : 2});
randFloatTest.createTest(randFloat, [{min : 0, max : 0}], 'range', {min : 0, max : 0});
randFloatTest.createTest(randFloat, [{min : -2, max : 0}], 'range', {min : -2, max : 0});
randFloatTest.createTest(randFloat, [{min : 1, max : 2}], 'range', {min : 1, max : 2});
randFloatTest.createTest(randFloat, [{min : -1, max : 1}], 'range', {min : -1, max : 1});
randFloatTest.createTest(randFloat, [{min : 0, max : 0.1}], 'range', {min : 0, max : 0.1});
randFloatTest.createTest(randFloat, [{min : -0.1, max : 0.1}], 'range', {min : -0.1, max : 0.1});

var numOfRuns = 1000;	// The number of runs of the function to test the range

for (var i = 0; i < numOfRuns; i++) {
	randFloatTest.testAll();
}

randFloatTest.summery();


