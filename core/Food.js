var Food = function(amount, coord) {
	this.amount = amount;
	this.coord = coord;
	this.colour;
};

// Is this needed or will it just add bloat?  And slow the system + use extra memory
Food.prototype.addToMap = function() {
	var index = coordToIndex(this.coord);
	MAP[index].food = this;
};

// Oppions?
Food.prototype.removeFromMap = function() {
	var index = coordToIndex(this.coord);	// As long as food has not changed pos
	MAP[index].food = void(0);
};