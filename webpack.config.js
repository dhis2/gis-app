var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

webpackBaseConfig.devServer = {
    contentBase: './',
    // progress: true, // Gives build error
    // colors: true, // Gives build error
    port: 8081,
    inline: true,
    // devtool: 'source-map', // Gives build error
};

module.exports = webpackBaseConfig;
