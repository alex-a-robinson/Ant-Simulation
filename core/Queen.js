Queen.prototype = new Ant(-1, {x : void(0), y : void(0)});
Queen.prototype.constructor = Queen;
Queen.prototype.parent = Ant;

function Queen(id, coord) {
	// Spatial attributes
	this.coord = coord;		// Coordinate of the ant
	
	// Identifiers
	this.id = id;			// The ants unique identifier
};


Queen.prototype.update = function() {
	this.parent.removeFromMap();
	this.parent.addToMap();
};