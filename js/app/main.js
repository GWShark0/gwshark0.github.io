require(['app/koch'], function(koch) {

	var size = window.innerHeight / 2;
	var degree = 4;
	var line_width = 2;

	var dim = koch.getDimensions(size, line_width);

	koch.generateSnowflake(dim, degree);
});