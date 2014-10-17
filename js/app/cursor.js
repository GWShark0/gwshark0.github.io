function Cursor(origin) {
	this.position = origin || {'x': 0, 'y': 0};
	this.angle = 0;
	this.history = [this.position];
}

Cursor.prototype.left = function(angle) {
	this.angle -= angle;
}

Cursor.prototype.right = function(angle) {
	this.angle += angle;
}

Cursor.prototype.draw = function(length) {
	var angle = this.angle * (Math.PI / 180);
	var x = this.position.x + (length * Math.cos(angle));
	var y = this.position.y + (length * Math.sin(angle));
	this.position = {'x': x, 'y': y};
	this.history.push(this.position);
}