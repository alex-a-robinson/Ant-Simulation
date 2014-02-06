// ---------- angleTo ----------

function arrowTo(coord1, coord2, angle) {
	window.onload = function () {
		var ctx = getElement(CANVAS.name).getContext('2d');
		simpleGrid(ctx);
	
		drawRect(ctx, scaleCoord(coord1), CELL_SIZE, '#FF0000');
		drawRect(ctx, scaleCoord(coord2), CELL_SIZE, '#0000FF');
		
		ctx.save();
		
		var scaledCoord = scaleCoord(coord1);
	
		// Translate and rotate the canvas (done so can draw at an angle)
		ctx.translate(scaledCoord.x + CELL_SIZE.width/2, scaledCoord.y + CELL_SIZE.height/2);
		ctx.rotate(angle);
		
		drawLine(ctx, {x : 0, y : 0}, {x : 0, y : -100}, '#FF0000', 1);
		drawLine(ctx, {x : 0, y : -100}, {x : 5, y : -95}, '#FF0000', 1);
		drawLine(ctx, {x : 0, y : -100}, {x : -5, y : -95}, '#FF0000', 1);
		
		ctx.restore();
	}
}

/**
* Test case - Test angleTo returns the correct angle to get from coord to target
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*	CELL_SIZE = {width : 50, height : 50};
*	GRID_SIZE = {width : 10, height : 10};
*
* Test data - coord : {x : 5, y : 5}, target : {x : 7, y : 5} [functional value]
* Expected  - Math.PI/2 ~= 1.5707
*
* Test data - coord : {x : 5, y : 5}, target : {x : 7, y : 7} [functional value]
* Expected  - 3 * Math.PI/4 ~= 2.35619
*
* Test data - coord : {x : 5, y : 5}, target : {x : 5, y : 8} [functional value]
* Expected  - Math.PI ~= 3.1415
*
* Test data - coord : {x : 5, y : 5}, target : {x : 3, y : 4} [functional value]
* Expected  - ~= -1.10714
*
* Test data - coord : {x : 5, y : 5}, target : {x : 5, y : 5} [edge case]
* Expected  - Math.PI/2 ~= 1.5707
*
* Test data - coord : {x : 8, y : 8}, target : {x : 1, y : 1} [edge case]
* Expected  - 3 * Math.PI/4 ~= 2.35619
*
* Test data - coord : {x : 7, y : 8}, target : {x : 3, y : 2} [edge case]
* Expected  - ~= 3.38657
*/

var MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
var CELL_SIZE = {width : 50, height : 50};
var GRID_SIZE = {width : 10, height : 10};

var angleToTest = new testCase('Test angleTo returns the correct angle to get from coord to target');
angleToTest.callback = arrowTo;

angleToTest.callbackArgs = [{x : 5, y : 5}, {x : 7, y : 5}];
angleToTest.createTest(angleTo, [{x : 5, y : 5}, {x : 7, y : 5}], 'equal', Math.PI/2);

angleToTest.callbackArgs = [{x : 5, y : 5}, {x : 7, y : 7}];
angleToTest.createTest(angleTo, [{x : 5, y : 5}, {x : 7, y : 7}], 'equal', 3 * Math.PI/4);

angleToTest.callbackArgs = [{x : 5, y : 5}, {x : 5, y : 8}];
angleToTest.createTest(angleTo, [{x : 5, y : 5}, {x : 5, y : 8}], 'equal', Math.PI);

angleToTest.callbackArgs = [{x : 5, y : 5}, {x : 3, y : 4}];
angleToTest.createTest(angleTo, [{x : 5, y : 5}, {x : 3, y : 4}], 'approx', -1.10714);

angleToTest.callbackArgs = [{x : 5, y : 5}, {x : 5, y : 5}];
angleToTest.createTest(angleTo, [{x : 5, y : 5}, {x : 5, y : 5}], 'equal', Math.PI/2);

angleToTest.callbackArgs = [{x : 8, y : 8}, {x : 1, y : 1}];
angleToTest.createTest(angleTo, [{x : 8, y : 8}, {x : 1, y : 1}], 'equal', 3 * Math.PI/4);

angleToTest.callbackArgs = [{x : 7, y : 8}, {x : 3, y : 2}];
angleToTest.createTest(angleTo, [{x : 7, y : 8}, {x : 3, y : 2}], 'approx', 3.38657);

angleToTest.testAll();

angleToTest.summery();

/* TEST FAILED

	Failed
	angleToTest.callbackArgs = [{x : 8, y : 8}, {x : 1, y : 1}];
	angleToTest.createTest(angleTo, [{x : 8, y : 8}, {x : 1, y : 1}], 'equal', 3 * Math.PI/4);

	Old function : 
	
	function angleTo(coord, target) {
			var dx = target.x - coord.x;
			var dy = target.y - coord.y;
			
			return Math.atan2(dy, dx) + Math.PI/2;
	}
		
	New function : 
	
	function angleTo(coord, target) {
		if (GRID_SIZE.width - Math.abs(target.x - coord.x) > Math.abs(target.x - coord.x)) {
			dx = target.x - coord.x;
		} else {
			dx = GRID_SIZE.width - (target.x - coord.x);
		}
		
		if (GRID_SIZE.height - Math.abs(target.y - coord.y) > Math.abs(target.y - coord.y)) {
			dy = target.y - coord.y;
		} else {
			dy = GRID_SIZE.height - (target.y - coord.y);
		}
		
		return Math.atan2(dy, dx) + Math.PI/2;
	}

*/
