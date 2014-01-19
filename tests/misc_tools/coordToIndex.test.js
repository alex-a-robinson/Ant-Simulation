// ---------- coordToIndex ----------

/**
* Test case - Test coordToIndex returns the correct index for a specific coordinate
* Environment- GRID_SIZE = {10, 10}
*
* Test data - {x : 0, y : 0}	[edge case]
* Expected  - 0
*
* Test data - {x : 5, y : 2}	[functional value]
* Expected  - 25
*/

var coordToIndexTest = new testCase('Test coordToIndex returns the correct index for a specific coordinate');

GRID_SIZE = {width : 10, height : 10};

coordToIndexTest.createTest(coordToIndex, [{x : 0, y : 0}], 'equal', 0);
coordToIndexTest.createTest(coordToIndex, [{x : 5, y : 2}], 'equal', 25);
coordToIndexTest.testAll();

coordToIndexTest.summery();


