define(['d3', 'randomColor', 'app/cursor'], function(d3, randomColor, cursor) {

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

	// computes dimensional information about the snowflake (width, height)
	var getDimensions = function(segment_length, line_width) {
		var width = segment_length + 2*line_width;
		var offset_top = Math.sqrt(Math.pow(segment_length/3, 2) - Math.pow(segment_length/3/2, 2));
		var height = segment_length + offset_top + 2*line_width;
		return {width: width, offset_top: offset_top, height: height, segment_length: segment_length, line_width: line_width};
	}

	// length of segments in 0-degree base curve
	// largest degree to draw snowflake (0-n)
	var generateSnowflake = function(dim, degree) {
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

		var paths = [];

		for (var i = degree; i >= 0; i--) {
			var cursor = new Cursor(origin);

			koch(cursor, dim.segment_length, i);
			cursor.right(120);
			koch(cursor, dim.segment_length, i);
			cursor.right(120);
			koch(cursor, dim.segment_length, i);

			paths.push(svg.append('path')
						  .attr('d', path(cursor.history))
						  .attr('stroke', colors[i])
						  .attr('stroke-width', dim.line_width)
						  .attr('fill', 'none'));
		}

		// animate the drawing of each path
		var speed = 2000;
		paths.reverse().forEach(function(path, i) {
			var length = path.node().getTotalLength();
			path.attr('stroke-dasharray', length + ' ' + length)
				.attr('stroke-dashoffset', length)
				.transition()
				.duration((i+1)*speed)
				.ease('linear')
				.attr('stroke-dashoffset', 0);
		});
	}

	return {
		getDimensions: getDimensions,
		generateSnowflake: generateSnowflake
	}
});
