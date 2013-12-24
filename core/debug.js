var show = function(coord, id) {
	this.coord = coord;
	this.id = id;
	this.colour = '#FF0000';
	this.size = CELL_SIZE;
	this.type = ANT_TYPE.debug;
};

show.prototype.addToMap = function() {
	MAP[coordToIndex(this.coord)].ant.push(this);
};

show.prototype.removeFromMap = function() {
	var index = MAP[coordToIndex(this.coord)].ant.indexOf(this);
	MAP[coordToIndex(this.coord)].ant.splice(index, 1);
};

show.prototype.draw = function(ctx) {
	ctx.globalAlpha = 0.2;
	drawRect(ctx, scaleCoord(this.coord), this.size, this.colour);
	ctx.globalAlpha = 1;
	this.removeFromMap();
};

show.prototype.sayHello = function() {
	console.log('Hello, DEBUG ant ' + this.id + ' at (' + this.coord.x + ',' + this.coord.y + ').')
};