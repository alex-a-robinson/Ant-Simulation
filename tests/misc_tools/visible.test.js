// ---------- visible ----------

/**
* Test case - Test that visible function correctly determines whether a cell is visible or not
*
* Environment:
* 	CELL_SIZE = {width : 50, height : 50};
* 	GRID_SIZE = {width : 10, height : 10};
*	START_COORD = {x : 0, y : 0};
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
START_COORD = {x : 0, y : 0};

log('Test that visible scales coordinates correctly');

simpleGridRect({x : 4, y : 2}, '#FF0000');
log('    For {x : 4, y : 2} visible is ' + visible({x : 4, y : 2}));

simpleGridRect({x : 0, y : 0}, '#FF0000');
log('    For {x : 0, y : 0} visible is ' + visible({x : 0, y : 0}));

simpleGridRect({x : -3, y : -2}, '#FF0000');
log('    For {x : -3, y : -2} visible is ' + visible({x : -3, y : -2}));	// Originally failed

simpleGridRect({x : 15, y : 12}, '#FF0000');
log('    For {x : 15, y : 12} visible is ' + visible({x : 15, y : 12}));

simpleGridRect({x : 9, y : 9}, '#FF0000');
log('    For {x : 9, y : 9} visible is ' + visible({x : 9, y : 9}));

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