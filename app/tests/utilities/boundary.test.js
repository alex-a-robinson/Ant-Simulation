// ---------- boundary ----------

/**
* Test case - Test that boundary returns the correct warped coordinate
*
* Environment:
*   bounds = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - {x : 4, y : 2}	[functional value]
* Expected  - {x : 4, y : 2}
*
* Test data - {x : 10, y : 10}	[edge case]
* Expected  - {x : 0, y : 0}
*
* Test data - {x : 10, y : 4}	[edge case]
* Expected  - {x : 0, y : 4}
*
* Test data - {x : 7, y : 10}	[edge case]
* Expected  - {x : 7, y : 0}
*/

var bounds = {x : {min : 0, max : 10}, y : {min : 0, max : 10}};
var CELL_SIZE = {width : 50, height : 50};
var GRID_SIZE = {width : 10, height : 10};

function boundaryTest(ctx, coord) {
	drawRect(ctx, scaleCoord(coord), CELL_SIZE, '#FF0000');
	drawRect(ctx, scaleCoord(boundary(coord, bounds)), CELL_SIZE, '#0000FF');

	log('    For ' + format(coord) + ' boundary is ' + format(boundary(coord, bounds)));
}


window.onload = function () {

	var ctx = getElement(CANVAS.name).getContext('2d');
	simpleGrid(ctx);
	
	log('Test that boundary returns the correct warped coordinate');
	
	boundaryTest(ctx, {x : 4, y : 2});
	boundaryTest(ctx, {x : 10, y : 10});
	boundaryTest(ctx, {x : 10, y : 4});
	boundaryTest(ctx, {x : 7, y : 10});
};