const jwt = require('jsonwebtoken')

const isNumber = (number) => {
	return !isNaN(parseFloat(number)) && isFinite(number)
}

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15d',
	})
}

module.exports = {
	isNumber,
	createAccessToken,
}
