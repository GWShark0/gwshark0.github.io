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

// koch curve algorithm
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
function generateSnowflake(dim, degree) {
	var origin = {
		'x': dim.line_width,
		'y': dim.line_width + dim.offset_top
	}

	var svg = d3.select('body').append('svg')
							   .attr('width', dim.width)
							   .attr('height', dim.height);

	var path = d3.svg.line()
					 .x(function(d) { return d.x; })
					 .y(function(d) { return d.y; })
					 .interpolate('linear-closed');

	var colors = randomColor({hue: 'red', luminosity: 'light', count: degree + 1});

	for (var i = degree; i >= 0; i--) {
		var cursor = new Cursor(origin);

		koch(cursor, dim.segment_length, i);
		cursor.right(120);
		koch(cursor, dim.segment_length, i);
		cursor.right(120);
		koch(cursor, dim.segment_length, i);

		svg.append('path')
		   .attr('d', path(cursor.history))
		   .attr('stroke', colors[i])
		   .attr('stroke-width', dim.line_width)
		   .attr('fill', 'none');
	}
}

// computes dimensional information about the snowflake (width, height)
function getDimensions(segment_length, line_width) {
	var width = segment_length + 2*line_width;
	var offset_top = Math.sqrt(Math.pow(segment_length/3, 2) - Math.pow(segment_length/3/2, 2));
	var height = segment_length + offset_top + 2*line_width;
	return {width: width, offset_top: offset_top, height: height, segment_length: segment_length, line_width: line_width};
}

document.addEventListener("DOMContentLoaded", function() {
	var size = window.innerHeight / 2;
	var degree = 4;
	var line_width = 2;

	var dim = getDimensions(size, line_width);

	generateSnowflake(dim, degree);

	/** Not quite there yet for this (only looks good via Desktop).
	 *
	size = window.innerHeight;
	dim = getDimensions(size, line_width);
	generateSnowflake(dim, degree);

	size = window.innerHeight * 2;
	dim = getDimensions(size, line_width);
	generateSnowflake(dim, degree);
	*/
});



