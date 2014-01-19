// ---------- scaleCoord ----------

/**
* Test case - Test that scaleCoord scales coordinates correctly
*
* Environment:
* 	CELL_SIZE = {width : 5, height : 5};
* 	START_COORD = {x : 3, y : 2};
*
* Test data - {x : 4, y : 2}	[functional value]
* Expected  - {x : 23, y : 12}	
*/

var scaleCoordTest = new testCase('Test that scaleCoord scales coordinates correctly');

CELL_SIZE = {width : 5, height : 5};
START_COORD = {x : 3, y : 2};

scaleCoordTest.createTest(scaleCoord, [{x : 4, y : 2}], 'equal', {x : 23, y : 12});
scaleCoordTest.testAll();

scaleCoordTest.summery();


