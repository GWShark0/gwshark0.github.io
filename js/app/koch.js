'use strict';

define(['d3', 'app/d3Util', 'randomColor', 'app/cursor'], function(d3, d3Util, randomColor) {

	// koch curve algorithm
	function kCurve(cursor, length, degree) {
		if (degree === 0) {
			cursor.draw(length);
		} else {
			length /= 3;
			degree--;
			kCurve(cursor, length, degree);
			cursor.left(60);
			kCurve(cursor, length, degree);
			cursor.right(120);
			kCurve(cursor, length, degree);
			cursor.left(60);
			kCurve(cursor, length, degree);
		}
	}

	// computes dimensional information about the snowflake (ie. width/height)
	function getDimensions(segment_length, line_width) {
		var width = segment_length + 2*line_width;
		var offset_top = Math.sqrt(Math.pow(segment_length/3, 2) - Math.pow(segment_length/3/2, 2));
		var height = segment_length + offset_top + 2*line_width;
		return {width: width, offset_top: offset_top, height: height};
	};

	/**
	 *         degree: largest degree to draw snowflake (0-n)
	 * segment_length: length of segments in 0-degree base curve
	 *     line_width: width of SVG lines
	 */
	var snowflake = function(degree, segment_length, line_width) {
		var dim = getDimensions(segment_length, line_width);
		var origin = { 'x': line_width, 'y': line_width + dim.offset_top };

		var svg = d3.select('body').append('svg')
									.attr('width', dim.width)
									.attr('height', dim.height);

		var cursors = [];
		for (var i = degree; i >= 0; i--) {
			var cursor = new Cursor(origin);
			kCurve(cursor, segment_length, i);
			cursor.right(120);
			kCurve(cursor, segment_length, i);
			cursor.right(120);
			kCurve(cursor, segment_length, i);
			cursors.push(cursor);
		}

		var colors = randomColor({hue: 'red', luminosity: 'light', count: degree + 1});

		var paths = cursors.map(function(cursor, i) {
			return d3Util.renderPath(svg, cursor, colors[i], line_width);
		});

		// animate the drawing of each path
		var duration = 2000;
		paths.reverse().forEach(function(path, i) {
			d3Util.showPath(path, (i+1)*duration);
		});
	};

	return {
		snowflake: snowflake
	}
});
