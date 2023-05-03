// Returns a random integer (not float) between min and max
function randRange(min, max) {
	return Math.floor(Math.random() * (max + 1 - min) + min)
}
exports.randRange = randRange;

// Returns a random item from an arry
function randChoice(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
exports.randChoice = randChoice;