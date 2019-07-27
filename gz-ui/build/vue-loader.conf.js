'use strict'
const utils = require('./utils')
const config = require('../config')

const env = process.env.NODE_ENV;
const isProduction = env === 'prd';

const sourceMapEnabled = isProduction ? config.prd.productionSourceMap : config[env].cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    	sourceMap: sourceMapEnabled,
    	extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config[env].cacheBusting,
  transformToRequire: {
	    video: ['src', 'poster'],
	    source: 'src',
	    img: 'src',
	    image: 'xlink:href'
  }
}
