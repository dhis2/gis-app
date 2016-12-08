var webpack = require('webpack');
var webpackBaseConfig = require('./webpack-base-config');

webpackBaseConfig.devServer = {
    contentBase: './',
    // colors: true, // Not working with latest Webpack
    port: 8081,
    inline: true,
    // devtool: 'source-map',  // Not working with latest Webpack
};

module.exports = webpackBaseConfig;
