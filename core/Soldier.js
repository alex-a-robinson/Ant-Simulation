Soldier.prototype = new Ant(-1, {x : void(0), y : void(0)});
Soldier.prototype.constructor = Soldier;
Soldier.prototype.parent = Ant;

function Soldier(id, coord) {
	// Spatial attributes
	this.coord = coord;		// Coordinate of the ant
	
	// Identifiers
	this.id = id;			// The ants unique identifier
};

Soldier.prototype.update = function() {
	this.parent.removeFromMap();
	this.parent.addToMap();
};