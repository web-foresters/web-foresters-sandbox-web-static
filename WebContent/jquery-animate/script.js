function growMoonSun() {
	$('#moon-sun').animate({ "border-width": "210px" }, 5000, shrinkMoonSun);
}

function shrinkMoonSun() {
	$('#moon-sun').animate({ "border-width": "10px" }, 5000, growMoonSun);
}

$(function() {
	shrinkMoonSun();
});