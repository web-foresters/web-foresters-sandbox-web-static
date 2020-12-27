function isPartOfAWord(ch) {
	return !(ch === ' ' || ch === '\t' || ch === '\n' || ch === '.');
}

function run() {
	var result = '';
	origText = $('#Source').val();
	var currentWord = '';
	for (var chIdx = 0; chIdx < origText.length; chIdx++) {
		var ch = origText.charAt(chIdx);
		if (isPartOfAWord(ch)) {
			currentWord += ch;
		} else {
			result += misspellWord(currentWord) + ch;
			currentWord = '';
		}
	}
	result += misspellWord(currentWord);
	$('#Dest').text(result);
}

function misspellWord(word) {
	if ((word.length < 4) || wordHasNonLetters(word)) {
		return word;	// For now, don't shuffle these: not sure if this works on words with non-letters in them
	}
	var result = word.charAt(0);
	var shuffled = shuffleWord(word);
	for (var shuffledIdx = 0; shuffledIdx < shuffled.length; shuffledIdx++) {
		result += shuffled[shuffledIdx];
	}
	return result + word.charAt(word.length - 1);
}

function shuffleWord(word) {
	console.log('SW ' + word + ' = ' + shuffleArray(getLettersToShuffle(word).split('')));
	return shuffleArray(getLettersToShuffle(word).split(''));
}

function getLettersToShuffle(word) {
	const result = word.match(/^.(.+).$/);
console.log(word + ' => ' + result[1]);
	return result[1];
}

function wordHasNonLetters(word) {
	return word.match(/^[a-z]*$/ig) === null;
//	for (var chIdx = 0; chIdx < word.length; chIdx++) {
//		var c = word.charAt(chIdx);
//		if (c === '-' || c === '/'
//	}
}


/**
 * FROM: https://stackoverflow.com/a/12646864/1003157
 * 
 * NOTE, this also has a nice ES6 solution for this
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
console.log(array[i] + ' <=> ' + array[j]);
    }
    return array;
}

//var a = [1, 2, 3, 4, 5, 6, 7, 8];
//console.log('shuffled array 1-8: ', JSON.stringify(shuffleArray(a)));
//console.log('shuffled array 1-8: ', JSON.stringify(shuffleArray(a)));
//console.log('shuffled array 1-8: ', JSON.stringify(shuffleArray(a)));
//console.log('shuffled array 1-8: ', JSON.stringify(shuffleArray(a)));
//console.log('shuffled array 1-8: ', JSON.stringify(shuffleArray(a)));
