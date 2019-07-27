'use strict'
const merge = require('webpack-merge')
const prdEnv = require('./prd.env')

module.exports = merge(prdEnv, {
  NODE_ENV: '"dev"',
	BASE_API:'"http://localhost:8281"'
//	BASE_API:'"http://localhost:8880"'
//	BASE_API:'"http://10.34.1.83:8281"'
})
