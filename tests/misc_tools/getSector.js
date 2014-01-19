// ---------- getSector ----------

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
* Test case - Test getSector returns sector of correct radius
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - coord : {x : 50, y : 50}, radius : 20, direction : 0, angle : Math.PI [functional value]
* Expected  - A circle in cells radius 20 centred at {x : 50, y : 50}
*/

var MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
var CELL_SIZE = {width : 50, height : 50};
var GRID_SIZE = {width : 10, height : 10};

var getSectorRadiusTest = new testCase('Test getBlock returns a block of cells the correct size');
getSectorRadiusTest.callback = drawBlocks;

getSectorRadiusTest.createTest(getSector, [{x : 5, y : 5}, {width : 0, height : 0}], 'desc', 'A single block centred at {x : 5, y : 5}');

getSectorRadiusTest.testAll();
