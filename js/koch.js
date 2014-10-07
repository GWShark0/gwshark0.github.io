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

// Koch curve al
function koch(cursor, length, degree) {
	if (degree == 0) {
		cursor.draw(length);
	} else {
		length /= 3;
		degree--;
		koch(cursor, length, degree);
		cursor.left(60);
		koch(cursor, length, degree);
		cursor.right(120);
		koch(cursor, length, degree);
		cursor.left(60);
		koch(cursor, length, degree);
	}
}

// length of segments in 0-degree base curve
// largest degree to draw snowflake (0-n)
function generateSnowflake(length, degree, line_width) {
	var width = length + 2*line_width;
	var top = Math.sqrt(Math.pow(length/3, 2) - Math.pow(length/3/2, 2));
	var height = length + top + 2*line_width;

	var origin = {
		'x': line_width,
		'y': line_width + top
	}

	var svg = d3.select('body').append('svg')
							   .attr('width', width)
							   .attr('height', height);

	var path = d3.svg.line()
					 .x(function(d) { return d.x; })
					 .y(function(d) { return d.y; })
					 .interpolate('linear-closed');

	var colors = randomColor({hue: 'red', luminosity: 'light', count: degree + 1});

	for (var i = degree; i >= 0; i--) {
		var cursor = new Cursor(origin);

		koch(cursor, length, i);
		cursor.right(120);
		koch(cursor, length, i);
		cursor.right(120);
		koch(cursor, length, i);

		svg.append('path')
		   .attr('d', path(cursor.history))
		   .attr('stroke', colors[i])
		   .attr('stroke-width', line_width)
		   .attr('fill', 'none');
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	var size = window.innerHeight / 2;
	generateSnowflake(size, 4, 2);
});
