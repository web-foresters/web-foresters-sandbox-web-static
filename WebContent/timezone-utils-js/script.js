$(function () {
	//TODO: write your page related code here...
//	console.log('Hello');
	const now = new Date();
	const ONE_HOUR_MS = 3600000;
	// TODO: Currently coded to DST offset: need to check date to get the correct "NY TIME"
	var nowNewYork = shiftTimeToNewYork(now); //new Date(now.getTime() - (ONE_HOUR_MS * 4));
	$('#CurrentTimeLocal').text(getDateTimeString(now));
	$('#CurrentTimeNewYork').text(getDateTimeString(nowNewYork));
	testDates();
});

function shiftTimeToNewYork(date) {
	var dateUtcMs = date.getTime() - date.getTimezoneOffset();
	// TODO: code 5 hours for 03/14 01:59:59.999 to 11/07 01:59:59.999
	// TODO: code 4 hours from 11/07 02:00:00
	return new Date(dateUtcMs - getNewYorkTimezoneOffsetFor2020To2021(date));
}

function getDateTimeString(date) {
	return date.toLocaleDateString() + ' ' + getLocaleTimeHhMm(date);
}

function getLocaleTimeHhMm(date) {
	return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
}

/**
 * Returns offset from UTC to NY.
 * 
 * WARNING: This works from 2am Nov 01 2020 until November 7 1:59:59am.
 * Before DST starts in 2020 will be incorrect for Summer.
 * After DST starts in 2022 will be incorrect for Winter.
 */
function getNewYorkTimezoneOffsetFor2020To2021(date) {
	const timeMs = date.getTime();
	const NY_DST_START_2021 = 1615705200000;
	const NY_DST_END_2021 = 1636264800000;
	if ((timeMs >= NY_DST_START_2021) && (timeMs < NY_DST_END_2021)) {
		return 240;
	} else {
		return 300;
	}
}

// These tests will only work in NY time zone
function testDates() {
	// Fail one to make sure fails happen
	testDate('03/14/2021 01:59:59', 'INTENTIONAL FAILURE');
	testDate('03/14/2021 01:59:59', '3/14/2021 1:59 AM');
}

function testDate(dtString, expected) {
	var date = new Date(dtString);
	assert(expected, getDateTimeString(date), dtString)
}

function assert(expected, actual, msg) {
	var result = expected === actual;
	if (result) {
		console.log('Test Successful ' + msg, expected);
	} else {
		console.error('Test FAILED ' + msg, 'expected: "' + expected + '"', 'actual: "' + actual + '"');
	}
}
