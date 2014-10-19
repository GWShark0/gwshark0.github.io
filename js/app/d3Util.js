define(['d3'], function(d3) {

	return {
		line: d3.svg.line()
					.x(function(d) { return d.x; })
					.y(function(d) { return d.y; })
					.interpolate('linear-closed'),

		renderPath: function(svg, cursor, color, line_width) {
			var path = svg.append('path')
						  .attr('d', this.line(cursor.history))
						  .attr('stroke', color)
						  .attr('stroke-width', line_width)
						  .attr('fill', 'none');
			var length = path.node().getTotalLength();
			path.attr('stroke-dasharray', length + ' ' + length)
				.attr('stroke-dashoffset', length)
				.attr('total-length', length);
			return path;
		},

		showPath: function(path, duration) {
			path.transition()
				.duration(duration)
				.ease('linear')
				.attr('stroke-dashoffset', 0);
		},

		hidePath: function(path, duration) {
			var length = path.attr('total-length');
			path.transition()
				.duration(duration)
				.ease('linear')
				.attr('stroke-dashoffset', length);
		}
	}
});
