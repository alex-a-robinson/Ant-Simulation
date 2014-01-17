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

var randIntTest = new testCase('Test randInt returns a value within a specific range');

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


