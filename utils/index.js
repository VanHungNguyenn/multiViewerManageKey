const jwt = require('jsonwebtoken')

const isNumber = (number) => {
	return !isNaN(parseFloat(number)) && isFinite(number)
}

const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	})
}

const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	})
}

module.exports = {
	isNumber,
	createRefreshToken,
	createAccessToken,
}
