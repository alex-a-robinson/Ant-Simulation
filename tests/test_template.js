// ---------- getBlock ----------

/**
* Test case - Test getBlock returns a block of cells the correct size
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - coord : {x : 5, y : 5}, size : {width : 0, height : 0} [functional value]
* Expected  - A single block centred at {x : 5, y : 5}
*
* Test data - coord : {x : 5, y : 5}, size : {width : 0, height : 0} [functional value]
* Expected  - A single block centred at {x : 5, y : 5}
*/

var getBlockSizeTest = new testCase('Test getBlock returns a block of cells the correct size');

//getBlockSizeTest.createTest(getBlock, [testData], 'type', {min : 0, max : 100});
// getBlockSizeTest.testAll();
//

getBlockSizeTest.summery();

/**
* Test case - Test getBlock returns a block of cells even when on the egde of the grid
*
* Test data - 
* Expected  - 
*/

var getBlockSizeTest = new testCase('Test getBlock returns a block of cells the correct size');


