// ---------- Soldier.soldiersInView ----------

/**
* Test case - Test that soldier in view returns true when there are soldiers in view
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*        CELL_SIZE = {width : 50, height : 50};
*        GRID_SIZE = {width : 10, height : 10};
*        NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - No ants in view
* Expected  - returns false i.e. no soldiers in view
*
* Test data - Multiple ants within viewing distance which are both workers and soldiers
* Expected  - returns true
*
* Test data - A single ant within viewing distance which is not a soldier
* Expected  - returns false
*
* Test data - A single ant within viewing distance which is a soldier
* Expected  - returns true
*/

var SoldiersInViewTest = new testCase('Test that soldier in view returns true when there are soldiers in view');
SoldiersInViewTest.autorun = true;

var testAntSpecies = {chars : {eyesight : 10, eyeAngle : Math.PI*2}};        // simulate a species
var testAnt = new Soldier(1, {x : 25, y : 25});
testAnt.species = testAntSpecies;
testAnt.direction = 0;

SoldiersInViewTest.callwith = testAnt;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;


// 1
createMap();
testAnt.scan();

SoldiersInViewTest.createTest(testAnt.soldiersInView, [], 'equal', false);


// 2
createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 26, y : 24})].ant = [{id : 1, species : testAntSpecies, type : ANT_TYPE.soldier}];
MAP[coordToIndex({x : 24, y : 22})].ant = [{id : 2, species : testAntSpecies, type : ANT_TYPE.worker}];
MAP[coordToIndex({x : 27, y : 18})].ant = [{id : 3, species : testAntSpecies, type : ANT_TYPE.nest}];

testAnt.scan();

SoldiersInViewTest.createTest(testAnt.soldiersInView, [], 'equal', true);


// 3
createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 24, y : 22})].ant = [{id : 1, species : testAntSpecies, type : ANT_TYPE.worker}];

testAnt.scan();

SoldiersInViewTest.createTest(testAnt.soldiersInView, [], 'equal', false);


// 4
createMap();

// Simulate the dummy ants
MAP[coordToIndex({x : 23, y : 24})].ant = [{id : 1, species : testAntSpecies, type : ANT_TYPE.soldier}];

testAnt.scan();

SoldiersInViewTest.createTest(testAnt.soldiersInView, [], 'equal', true);

SoldiersInViewTest.summery();

/**
* Test case - Test that soldier in view correctly determines if there are friendly (i.e. of same species) ants in view
*
* Environment:
*   MAP_BOUNDARY = {x : {min : 0, max : 10}, y : {min : 0, max : 10}}
*        CELL_SIZE = {width : 50, height : 50};
*        GRID_SIZE = {width : 10, height : 10};
*        NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;
*
* Test data - A solider ant of the same species
* Expected  - returns true
*
* Test data - A soldier ant of a different species
* Expected  - returns false
*/

var SoldiersInViewOfSameSpeciesTest = new testCase('Test that soldier in view correctly determines if there are friendly (i.e. of same species) ants in view');
SoldiersInViewOfSameSpeciesTest.autorun = true;

var testAntSpecies1 = {chars : {eyesight : 10, eyeAngle : Math.PI*2}};        // simulate a species
var testAntSpecies2 = {chars : {eyesight : 11, eyeAngle : Math.PI*2}};        // simulate a species
var testAnt = new Soldier(1, {x : 25, y : 25});
testAnt.species = testAntSpecies1;
testAnt.direction = 0;

SoldiersInViewOfSameSpeciesTest.callwith = testAnt;

MAP_BOUNDARY = {x : {min : 0, max : 50}, y : {min : 0, max : 50}}
CELL_SIZE = {width : 10, height : 10};
GRID_SIZE = {width : 50, height : 50};
NUM_OF_CELLS = GRID_SIZE.width * GRID_SIZE.height;


// 1
createMap();

MAP[coordToIndex({x : 26, y : 24})].ant = [{id : 1, species : testAntSpecies1, type : ANT_TYPE.soldier}];

testAnt.scan();

SoldiersInViewOfSameSpeciesTest.createTest(testAnt.soldiersInView, [], 'equal', true);


// 2
createMap();

MAP[coordToIndex({x : 26, y : 24})].ant = [{id : 1, species : testAntSpecies2, type : ANT_TYPE.soldier}];

testAnt.scan();

SoldiersInViewOfSameSpeciesTest.createTest(testAnt.soldiersInView, [], 'equal', false);


SoldiersInViewOfSameSpeciesTest.summery();