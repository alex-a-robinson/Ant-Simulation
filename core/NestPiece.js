var NestPiece = function(id, coord, nest) {
	// Spatial attributes
	this.size = CELL_SIZE;	// The size of the ant <--- this is in {x, y} so can be scaled and size of ant can be given
	this.coord = coord;		// Coordinate of the nest peice
	this.nest = nest;
	this.id = id;
	this.type = ANT_TYPE.nest;
};

// Adds the current position of the ant to the map
NestPiece.prototype.addToMap = function() {
	MAP[coordToIndex(this.coord)].ant.push(this);
};

// Removes the previous position of the ant from the map
NestPiece.prototype.removeFromMap = function() {
	var index = MAP[coordToIndex(this.coord)].ant.indexOf(this);
	MAP[coordToIndex(this.coord)].ant.splice(index, 1);
};

NestPiece.prototype.draw = function(ctx) {
	drawRect(ctx, scaleCoord(this.coord), this.size, this.nest.species.colour.nest);
};

NestPiece.prototype.sayHello = function() {
	console.log('Hello, piece ' + this.id + ' from ' + this.nest.id + ' at (' + this.coord.x + ',' +  this.coord.y + ').');
};