const isNumber = (number) => {
	return !isNaN(parseFloat(number)) && isFinite(number)
}

module.exports = {
	isNumber,
}
