var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

webpackBaseConfig.plugins = [
    // Replace any occurance of process.env.NODE_ENV with the string 'production'
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '\'production\'',
        },
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false // Includes many warnings from 3rd party libraries
        },
        mangle: false, // Don't work with ee_api_js_debug.js
        sourceMap: true, // https://github.com/dhis2/gis-api/issues/3
    }),
];

module.exports = webpackBaseConfig;