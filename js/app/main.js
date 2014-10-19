require(['app/koch'], function(koch) {
	var degree = 4;
	var segment_length = window.innerHeight / 2;
	var line_width = 2;

	koch.snowflake(degree, segment_length, line_width);
});
