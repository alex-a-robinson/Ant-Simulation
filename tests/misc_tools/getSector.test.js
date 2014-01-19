// ---------- getSector ----------

function drawBlocks(centerBlock, blocks) {
	window.onload = function () {
		var ctx = getElement(CANVAS.name).getContext('2d');
		drawBackground(ctx);
		simpleGrid(ctx);
		
		for (var i = 0; i < blocks.length; i++) {
			drawRect(ctx, scaleCoord(blocks[i]), CELL_SIZE, '#0000FF');
		}		
		
		drawRect(ctx, scaleCoord(centerBlock), CELL_SIZE, '#FF0000');
	}
}

/**
* Test case - Test getSector returns sector of correct radius
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*
* Test data - coord : {x : 25, y : 25}, radius : 15, direction : 0, angle : 2 * Math.PI [functional value]
* Expected  - A circle of radius 15 centred at {x : 25, y : 25}
*
* Test data - coord : {x : 25, y : 25}, radius : 6, direction : 0, angle : 2 * Math.PI [functional value]
* Expected  - A circle of radius 6 centred at {x : 25, y : 25}
*/

var MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
var CELL_SIZE = {width : 10, height : 10};
var GRID_SIZE = {width : 50, height : 50};

var getSectorRadiusTest = new testCase('Test getSector returns sector of correct radius');
getSectorRadiusTest.callback = drawBlocks;
getSectorRadiusTest.callbackArgs = [{x : 25, y : 25}];

getSectorRadiusTest.createTest(getSector, [{x : 25, y : 25}, 15, 0, 2 * Math.PI], 'none', 'A circle of radius 15 centred at {x : 25, y : 25}');

getSectorRadiusTest.createTest(getSector, [{x : 25, y : 25}, 6, 0, 2 * Math.PI], 'none', 'A circle of radius 6 centred at {x : 25, y : 25}');

getSectorRadiusTest.testAll();
getSectorRadiusTest.summery();

/**
* Test case - Test getSector returns sector at the correct angle
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*
* Test data - coord : {x : 25, y : 25}, radius : 15, direction : 0, angle : Math.PI [functional value]
* Expected  - A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI i.e. a semi circle
*
* Test data - coord : {x : 25, y : 25}, radius : 15, direction : 0, angle : Math.PI/4 [functional value]
* Expected  - A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4
*/

var MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
var CELL_SIZE = {width : 10, height : 10};
var GRID_SIZE = {width : 50, height : 50};

var getSectorAngleTest = new testCase('Test getSector returns sector at the correct angle');
getSectorAngleTest.callback = drawBlocks;
getSectorAngleTest.callbackArgs = [{x : 25, y : 25}];

getSectorAngleTest.createTest(getSector, [{x : 25, y : 25}, 15, 0, Math.PI], 'none', 'A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI i.e. a semi circle');

getSectorAngleTest.createTest(getSector, [{x : 25, y : 25}, 15, 0, Math.PI / 4], 'none', 'A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4');

getSectorAngleTest.testAll();
getSectorAngleTest.summery();

/**
* Test case - Test getSector returns sector in correct direction
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
*	CELL_SIZE = {width : 10, height : 10};
*	GRID_SIZE = {width : 50, height : 50};
*
* Test data - coord : {x : 25, y : 25}, radius : 15, direction : Math.PI, angle : Math.PI/4 [functional value]
* Expected  - A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4 pointing downwards
*
* Test data - coord : {x : 25, y : 25}, radius : 15, direction : 6 * Math.PI / 4, angle : Math.PI/4 [functional value]
* Expected  - A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4 pointing along the centre line of the 4th and 3rd quadrants
*
* Test data - coord : {x : 25, y : 25}, radius : 15, direction : 3.657, angle : Math.PI/4 [functional value]
* Expected  - A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4 pointing along the centre line of 3.657 radians
*/

var MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
var CELL_SIZE = {width : 10, height : 10};
var GRID_SIZE = {width : 50, height : 50};

var getSectorDirectionTest = new testCase('Test getSector returns sector at the correct angle');
getSectorDirectionTest.callback = drawBlocks;
getSectorDirectionTest.callbackArgs = [{x : 25, y : 25}];

getSectorDirectionTest.createTest(getSector, [{x : 25, y : 25}, 15, Math.PI, Math.PI/4], 'none', 'A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4 pointing downwards');

getSectorDirectionTest.createTest(getSector, [{x : 25, y : 25}, 15, 6 * Math.PI / 4, Math.PI/4], 'none', 'A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4 pointing along the centre line of the 4th and 3rd  quadrants');

getSectorDirectionTest.createTest(getSector, [{x : 25, y : 25}, 15, 3.657, Math.PI/4], 'none', 'A sector of radius 15 centred at {x : 25, y : 25} with an angle of Math.PI/4 pointing along the center line of 3.657 radians');

getSectorDirectionTest.testAll();
getSectorDirectionTest.summery();
