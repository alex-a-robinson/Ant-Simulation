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

log('Test that boundary returns the correct warped coordinate');

simpleGridRect({x : 4, y : 2}, '#FF0000');
simpleGridRect(boundary({x : 4, y : 2}, bounds), '#0000FF');
log('    For {x : 4, y : 2} boundary is {x : ' + boundary({x : 4, y : 2}, bounds).x + ', y : ' + boundary({x : 4, y : 2}, bounds).y + '}');


simpleGridRect({x : 10, y : 10}, '#FF0000');
simpleGridRect(boundary({x : 10, y : 10}, bounds), '#0000FF');
log('    For {x : 10, y : 10} boundary is {x : ' + boundary({x : 10, y : 10}, bounds).x + ', y : ' + boundary({x : 10, y : 10}, bounds).y + '}');


simpleGridRect({x : 10, y : 4}, '#FF0000');
simpleGridRect(boundary({x : 10, y : 4}, bounds), '#0000FF');
log('    For {x : 10, y : 4} boundary is {x : ' + boundary({x : 10, y : 4}, bounds).x + ', y : ' + boundary({x : 10, y : 4}, bounds).y + '}');


simpleGridRect({x : 7, y : 10}, '#FF0000');
simpleGridRect(boundary({x : 7, y : 10}, bounds), '#0000FF');
log('    For {x : 7, y : 10} boundary is {x : ' + boundary({x : 7, y : 10}, bounds).x + ', y : ' + boundary({x : 7, y : 10}, bounds).y + '}');