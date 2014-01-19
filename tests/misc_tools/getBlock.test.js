// ---------- getBlock ----------

function drawBlocks(blocks) {
	window.onload = function () {
		var ctx = getElement(CANVAS.name).getContext('2d');
		simpleGrid(ctx);
	
		for (var i = 0; i < blocks.length; i++) {
			drawRect(ctx, scaleCoord(blocks[i]), CELL_SIZE, '#0000FF');
		}		
	}
}

/**
* Test case - Test getBlock returns a block of cells the correct size
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - coord : {x : 5, y : 5}, size : {width : 0, height : 0} [edge case]
* Expected  - A single block centred at {x : 5, y : 5}
*
* Test data - coord : {x : 5, y : 5}, size : {width : 3, height : 3} [functional value]
* Expected  - A 7 wide and 7 tall block centred at {x : 5, y : 5}
*
* Test data - coord : {x : 5, y : 5}, size : {width : 1, height : 3} [functional value]
* Expected  - A 3 wide and 7 tall block centred at {x : 5, y : 5}
*/

var MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
var CELL_SIZE = {width : 50, height : 50};
var GRID_SIZE = {width : 10, height : 10};

var getBlockSizeTest = new testCase('Test getBlock returns a block of cells the correct size');
getBlockSizeTest.callback = drawBlocks;

getBlockSizeTest.createTest(getBlock, [{x : 5, y : 5}, {width : 0, height : 0}], 'desc', 'A single block centred at {x : 5, y : 5}');

getBlockSizeTest.createTest(getBlock, [{x : 5, y : 5}, {width : 3, height : 3}], 'none', 'A 7 wide and 7 tall block centred at {x : 5, y : 5}');

getBlockSizeTest.createTest(getBlock, [{x : 5, y : 5}, {width : 1, height : 3}], 'none', 'A 3 wide and 7 tall block centred at {x : 5, y : 5}');

getBlockSizeTest.testAll();

/**
* Test case - Test getBlock returns a block of cells the correct position
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - coord : {x : 1, y : 3}, size : {width : 2, height : 2} [edge case]
* Expected  - A 5 wide and 5 tall block centred at {x : 1, y : 3} which wraps to the other side of the map
*
* Test data - coord : {x : 0, y : 0}, size : {width : 1, height : 1} [edge case]
* Expected  - A 3 wide and 3 tall block centred at {x : 0, y : 0} which wraps to every corner of the map
*
*/

var MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
var CELL_SIZE = {width : 50, height : 50};
var GRID_SIZE = {width : 10, height : 10};

var getBlockPositionTest = new testCase('Test getBlock returns a block of cells the correct position');
getBlockPositionTest.callback = drawBlocks;

getBlockPositionTest.createTest(getBlock, [{x : 1, y : 3}, {width : 2, height : 2}], 'none', 'A 5 wide and 5 tall block centred at {x : 1, y : 3} which wraps to the other side of the map');

getBlockPositionTest.createTest(getBlock, [{x : 0, y : 0}, {width : 1, height : 1}], 'none', 'A 3 wide and 3 tall block centred at {x : 0, y : 0} which wraps to every corner of the map');

getBlockPositionTest.testAll();


