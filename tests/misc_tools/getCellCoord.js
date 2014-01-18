// ---------- getCellCoord ----------

/**
* Test case - Test that getCellCoord returns the correct cell for a particular coordinate
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - {x : 7.2, y : 3.6}	[functional value]
* Expected  - {x : 7, y : 3}
*
*/

var MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}};
var CELL_SIZE = {width : 50, height : 50};
var GRID_SIZE = {width : 10, height : 10};

function getCellCoordTest(ctx, coord) {
	drawArc(ctx,  scaleCoord(coord), 5, 0, 2 * Math.PI, '#000000', 1, '#FF0000');
	drawRect(ctx, scaleCoord(getCellCoord(coord)), CELL_SIZE, '#0000FF');

	log('    For ' + format(coord) + ' getCellCoord is ' + format(getCellCoord(coord)));
}


window.onload = function () {

	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	log('Test that getCellCoord returns the correct cell for a particular coordinate');
	
	getCellCoordTest(ctx, {x : 7.2, y : 3.6});
};

// FAIL
/*

	getCellCoordTest(ctx, {x : 7.2, y : 3.5}) test failed.
	
	Original function:
	
	function getCellCoord(coord) {
		return boundary({x: Math.round(coord.x), y: Math.round(coord.y)}, MAP_BOUNDARY);
	}
	
	Fixed function: 
	
	function getCellCoord(coord) {
		return boundary({x: Math.floor(coord.x), y: Math.floor(coord.y)}, MAP_BOUNDARY);
	}

*/