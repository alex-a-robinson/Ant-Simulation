// ---------- visible ----------

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
* Test case - Test that visible function correctly determines whether a cell is visible or not
*
* Environment:
* 	CELL_SIZE = {width : 50, height : 50};
* 	GRID_SIZE = {width : 10, height : 10};
*	CANVAS_OFFSET = {x : 0, y : 0};
*
* Test data - {x : 4, y : 2}	[functional value]
* Expected  - true
*
* Test data - {x : 0, y : 0}	[edge case]
* Expected  - true		
*
* Test data - {x : -3, y : -2}	[negative [functional value]]
* Expected  - false	
*
* Test data - {x : 15, y : 12}	[negative [functional value]]
* Expected  - false			
*
* Test data - {x : 9, y : 9}	[edge case]
* Expected  - true		
*/

CELL_SIZE = {width : 50, height : 50};
GRID_SIZE = {width : 10, height : 10};
CANVAS_OFFSET = {x : 0, y : 0};

var visibleTest = new testCase('Test that visible function correctly determines whether a cell is visible or not');
visibleTest.createTest(visible, [{x : 4, y : 2}], 'equal', true);
visibleTest.createTest(visible, [{x : 0, y : 0}], 'equal', true);
visibleTest.createTest(visible, [{x : -3, y : -2}], 'equal', false);
visibleTest.createTest(visible, [{x : 15, y : 12}], 'equal', false);
visibleTest.createTest(visible, [{x : 9, y : 9}], 'equal', true);

visibleTest.testAll();
visibleTest.summery();

/* Old visible function
function visible(coord) {
	var scaledCoord = scaleCoord(coord);
	if (sscaledCoord.x < GRID_SIZE.width * CELL_SIZE.width && scaledCoord.y < GRID_SIZE.height * CELL_SIZE.height)
		return true;
	else
		return false;
}


* New visible function
function visible(coord) {
	var scaledCoord = scaleCoord(coord);
	if (scaledCoord.x >= 0 && scaledCoord.x < GRID_SIZE.width * CELL_SIZE.width && scaledCoord.y >= 0 && scaledCoord.y < GRID_SIZE.height * CELL_SIZE.height)
		return true;
	else
		return false;
}

as 

simpleGridRect({x : -3, y : -2}, '#FF0000');
log('    For {x : -3, y : -2} visible is ' + visible({x : -3, y : -2}));	// Originally failed
*/