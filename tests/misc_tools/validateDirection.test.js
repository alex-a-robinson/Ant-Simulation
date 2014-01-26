// ---------- validateDirection ----------

/**
* Test case - Test randInt returns the correct value
* Test data - 5 * Math.PI [Functioning value]
* Expected  - 1 * Math.PI
* Test data - 2 * Math.PI [edge case]
* Expected  - 0
* Test data - 0	[edge case]
* Expected  - 0
* Test data - 4 [[Functioning value] non multiple of PI]
* Expected  - 4
* Test data - -2 * Math.PI	[negitive [Functioning value]]
* Expected  - 0
*/

var validateDirectionTest = new testCase('Test randInt returns the correct value');

validateDirectionTest.createTest(validateDirection, [5 * Math.PI], 'equal', 1 * Math.PI);
validateDirectionTest.createTest(validateDirection, [1 * Math.PI], 'equal', 1 * Math.PI);
validateDirectionTest.createTest(validateDirection, [0], 'equal', 0);
validateDirectionTest.createTest(validateDirection, [4], 'equal', 4);
validateDirectionTest.createTest(validateDirection, [-2 * Math.PI], 'equal', 0);

validateDirectionTest.testAll();
validateDirectionTest.summery();


