const webpack = require('webpack');
const path = require('path');
const colors = require('colors');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevBuild = process.argv[1].indexOf('webpack-dev-server') !== -1;
const isProfileBuild = process.argv[1].indexOf('--profile') !== -1;
const dhisConfigPath = process.env.DHIS2_HOME && `${process.env.DHIS2_HOME}/config`;

var dhisConfig;

try {
    dhisConfig = require(dhisConfigPath);
//    console.log('\nLoaded DHIS config:');
} catch (e) {
    // Failed to load config file - use default config
    console.warn(`\nWARNING! Failed to load DHIS config:`, e.message);
    console.info('Using default config');
    dhisConfig = {
        baseUrl: 'http://localhost:8080', // baseUrl: 'http://localhost:8080/dhis',
        authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=', // admin:district
    };
}
console.log(JSON.stringify(dhisConfig, null, 2), '\n');

function bypass(req, res, opt) {
    req.headers.Authorization = dhisConfig.authorization;
    console.log('[PROXY]'.cyan.bold, req.method.green.bold, req.url.magenta, '=>'.dim, opt.target.dim);
}

// const scriptPrefix = (isDevBuild ? dhisConfig.baseUrl : '..');
const scriptPrefix = dhisConfig.baseUrl;

module.exports = {
    context: __dirname,
    entry: {
        'app': './src/app.js',
        // 'map': './src/map.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'src/'),
                    path.resolve(__dirname, '../gis-api/src/'),
                ],
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-2'],
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader',
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 4,
                            },
                            pngquant: {
                                quality: '75-90',
                                speed: 3,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'Promise': 'es6-promise',
            'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv),
            },
        }),
        new HTMLWebpackPlugin({
            template: './index.ejs',
            vendorScripts: [
                `${scriptPrefix}/dhis-web-core-resource/babel-polyfill/6.20.0/dist/polyfill${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/react/15.4.2/react-with-touch-tap-plugin${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/rxjs/4.1.0/rx.lite${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/lodash/4.15.0/lodash${isDevBuild ? '' : '.min'}.js`,
                `${scriptPrefix}/dhis-web-core-resource/lodash-functional/1.0.1/lodash-functional.js`,
                [`${scriptPrefix}/dhis-web-core-resource/ckeditor/4.6.1/ckeditor.js`, 'defer async'],
            ]
                .map(script => {
                    if (Array.isArray(script)) {
                        return (`<script ${script[1]} src="${script[0]}"></script>`);
                    }
                    return (`<script src="${script}"></script>`);
                })
                .join("\n"),
        }),
    ],
    externals: [ // TODO: Only add the externals we use
        {
            'react': 'var React',
            'react-dom': 'var ReactDOM',
            'rx': 'var Rx',
            'react-addons-transition-group': 'var React.addons.TransitionGroup',
            'react-addons-create-fragment': 'var React.addons.createFragment',
            'react-addons-update': 'var React.addons.update',
            'react-addons-pure-render-mixin': 'var React.addons.PureRenderMixin',
            'react-addons-shallow-compare': 'var React.addons.ShallowCompare',
            'lodash': 'var _',
            'lodash/fp': 'var fp',
        },
        /^react-addons/,
        /^react-dom$/,
        /^rx$/,
        /^lodash$/,
        /^lodash\/fp$/,
    ],
};
