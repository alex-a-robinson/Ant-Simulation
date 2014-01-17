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

var randFloatTest = new testCase('Test randFloat returns a value within a specific range');

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