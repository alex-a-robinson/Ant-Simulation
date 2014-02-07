// ---------- Nest.reproduce ----------
/**
* Test case - Test that reproduce produces the correct probabilities
*
* Note : not testing Nest.viable function so is rediffined to always return true
*
* Test data - Soldier probability = 1, worker and queen probabilities = 0
* Expected - Only soldier ants produced after 1000 runs.
* 
* Test data - Soldier, Worker and Queen probabilites are all 1
* Expected - A 1/3 chance of each type of ant
* 
* Test data - Soldier, Worker and Queen probabilites are all 0
* Expected - No ants created
*/


var reproductionProbabilitesTest = new testCase('Test that reproduce produces the correct probabilities');
reproductionProbabilitesTest.autorun = true;

NUMBER_OF_ITERATIONS = 10000;

NUMBER_OF_WORKERS = 0;
NUMBER_OF_SOLDIERS = 0;
NUMBER_OF_QUEENS = 0;

var species = {chars : {reproductionWorkerProb : 0, reproductionSoldierProb : 1, reproductionQueenProb  : 0}};

var testNest = new Nest();
reproductionProbabilitesTest.callwith = testNest;
testNest.species = species;

testNest.viable = function(antType) {
	return true;
}

testNest.createAnt = function(antType) {
	switch (antType) {
		case ANT_TYPE.worker:
			NUMBER_OF_WORKERS += 1;
			break;
		case ANT_TYPE.soldier:
			NUMBER_OF_SOLDIERS += 1;
			break;
		case ANT_TYPE.queen:
			NUMBER_OF_QUEENS += 1;
			break;
	}
}

// 1 

for (var i = 0; i < NUMBER_OF_ITERATIONS; i++) {
	testNest.reproduce();
}

var totalProb = NUMBER_OF_WORKERS + NUMBER_OF_SOLDIERS + NUMBER_OF_QUEENS;
var workerProb = NUMBER_OF_WORKERS / totalProb * 100;
var soldierProb = NUMBER_OF_SOLDIERS / totalProb * 100;
var queenProb = NUMBER_OF_QUEENS / totalProb * 100;

reproductionProbabilitesTest.createTest(workerProb, [], 'desc', 'The worker probability = 0%');
reproductionProbabilitesTest.createTest(soldierProb, [], 'desc', 'The soldier probability = 100%');
reproductionProbabilitesTest.createTest(queenProb, [], 'desc', 'The queen probability = 0%');

// 2

NUMBER_OF_WORKERS = 0;
NUMBER_OF_SOLDIERS = 0;
NUMBER_OF_QUEENS = 0;

species = {chars : {reproductionWorkerProb : 1, reproductionSoldierProb : 1, reproductionQueenProb  : 1}};
testNest.species = species;

for (var i = 0; i < NUMBER_OF_ITERATIONS; i++) {
	testNest.reproduce();
}

var totalProb = NUMBER_OF_WORKERS + NUMBER_OF_SOLDIERS + NUMBER_OF_QUEENS;
var workerProb = NUMBER_OF_WORKERS / totalProb * 100;
var soldierProb = NUMBER_OF_SOLDIERS / totalProb * 100;
var queenProb = NUMBER_OF_QUEENS / totalProb * 100;

reproductionProbabilitesTest.createTest(workerProb, [], 'desc', 'The worker probability ~= 33.3%');
reproductionProbabilitesTest.createTest(soldierProb, [], 'desc', 'The soldier probability ~= 33.3%');
reproductionProbabilitesTest.createTest(queenProb, [], 'desc', 'The queen probability ~= 33.3%');

// 3

NUMBER_OF_WORKERS = 0;
NUMBER_OF_SOLDIERS = 0;
NUMBER_OF_QUEENS = 0;

species = {chars : {reproductionWorkerProb : 0, reproductionSoldierProb : 0, reproductionQueenProb  : 0}};
testNest.species = species;

for (var i = 0; i < NUMBER_OF_ITERATIONS; i++) {
	testNest.reproduce();
}

reproductionProbabilitesTest.createTest(NUMBER_OF_WORKERS, [], 'equal', 0);
reproductionProbabilitesTest.createTest(NUMBER_OF_SOLDIERS, [], 'equal', 0);
reproductionProbabilitesTest.createTest(NUMBER_OF_QUEENS, [], 'equal', 0);

reproductionProbabilitesTest.summery();