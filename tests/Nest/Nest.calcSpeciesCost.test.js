// ---------- Nest.calcSpeciesCost ----------
/**
* Test case - Test that calcSpeciesCost correctly returns the sum of all characteristics
*
* CHARS = {speed : {healthModifier : 100}, stingSize : {healthModifier : 57}, eyesight : {healthModifier : 23}};
*
* Test data - species.chars = {speed : 0.51, stingSize : 3, eyesight : 5};
* Expected - specieCost = 337
* 
* Test data - species.chars = {speed : 0, stingSize : 0, eyesight : 0};
* Expected - specieCost = 0
*/


var calcSpeciesCostTest = new testCase('Test that calcSpeciesCost correctly returns the sum of all characteristics');
calcSpeciesCostTest.autorun = true;


var species = {chars : {speed : 0.51, stingSize : 3, eyesight : 5}};
CHARS = {speed : {healthModifier : 100}, stingSize : {healthModifier : 57}, eyesight : {healthModifier : 23}};

var testNest = new Nest();
calcSpeciesCostTest.callwith = testNest;
testNest.species = species;

// 1 
var species = {chars : {speed : 0.51, stingSize : 3, eyesight : 5}};
calcSpeciesCostTest.createTest(testNest.calcSpeciesCost, [], 'equal', 337);

// 2
species = {chars : {speed : 0, stingSize : 0, eyesight : 0}};

testNest.species = species;

calcSpeciesCostTest.createTest(testNest.calcSpeciesCost, [], 'equal', 0);

calcSpeciesCostTest.summery();