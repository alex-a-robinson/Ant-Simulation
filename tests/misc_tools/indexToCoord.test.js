// ---------- indexToCoord ----------

/**
* Test case - Test that indexToCoord returns the correct coordinate from a specific index
*
* Test data - 25	[functional value]
* Expected  - {x : 5, y : 2}	
*
* Test data - 0	[edge case]
* Expected  - {x : 0, y : 0}
*/

var indexToCoordTest = new testCase('Test that indexToCoord returns the correct coordinate from a specific index');

GRID_SIZE = {width : 10, height : 10};

indexToCoordTest.createTest(indexToCoord, [25], 'equal', {x : 5, y : 2});
indexToCoordTest.createTest(indexToCoord, [0], 'equal', {x : 0, y : 0});
indexToCoordTest.testAll();

indexToCoordTest.summery();


