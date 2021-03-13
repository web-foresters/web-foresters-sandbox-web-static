/*

	JavaScript Quiz

*/


var noValue1;
var noValue2 = window.dne;
function logUndefinedParameter() {
	function ignoreThisParam(ignored) {
		console.log("Type of a function parameter that was not given any value =", typeof ignored);
	}
	ignoreThisParam();
}
console.log("Type of a variable that was never defined =", typeof dne);
console.log("Type of a variable that was created but never set to any value =", typeof noValue1);
console.log("Type of a variable that was created and set to expression that returns undefined =", typeof noValue2);
logUndefinedParameter();