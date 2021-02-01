
const DEFAULT_ARRAY = [1, 4, 7, 12, 18., 24, 45, 63, 66, 72, 79, 81, 88, 97];

function binarySearch(value, arr) {
	if (!arr) {
		arr = DEFAULT_ARRAY;
	}
	var lowestIdx = 0;
	var highestIdx = arr.length - 1;
	function nextSearchIdx() {
		return Math.floor((highestIdx + lowestIdx) / 2);
	}
	function getDiff(value, itemInArray) {
		if (typeof value === 'number') {
			return value - itemInArray;
		} else {
			return value.toString().localeCompare(itemInArray.toString());
		}
	}
	while (highestIdx > lowestIdx) {
		var searchIdx = nextSearchIdx();
		var itemInArray = arr[searchIdx];
		var diff = getDiff(value, itemInArray);
		if (diff === 0) {
			console.log("Found in array:  '" + value + '"', arr);
			return true;
		} else if (diff > 0) {
			lowestIdx = searchIdx + 1;
		} else {
			highestIdx = searchIdx - 1;
		}
	}
	console.log("NOT in array:  '" + value + '"', arr);
	return false;
}