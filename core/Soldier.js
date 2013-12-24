Soldier.prototype = new Ant(-1, {x : void(0), y : void(0)});
Soldier.prototype.constructor = Soldier;
Soldier.prototype.parent = Ant;

function Soldier(id, coord) {
	// Spatial attributes
	this.coord = coord;		// Coordinate of the ant
	
	// Identifiers
	this.id = id;			// The ants unique identifier
	
	this.damge;
	this.targetAnt;			// The ant obj which soldier is attacking
};

Soldier.prototype.follow = function(this.target) {
	this.direction = angleTo(this.coord, this.target);
	this.prioritizeDirection = this.direction;
};

Soldier.prototype.attack = function(this.targetAnt) {
	var block = getBlock(this.coord, 1);		// can attack all enemies within a radius of 1
	for (var i = 0; i < block.length; i++) {
		var index = coordToIndex(block[i]);
		for (var k = 0; k < MAP[index].ant.length; k++) {
			var ant = MAP[index].ant[k];
			if (this.targetAnt === ant) {
				// ATTACK ANT
			}
		}
	}
};


Soldier.prototype.update = function() {
	this.parent.removeFromMap();
	this.parent.addToMap();
};