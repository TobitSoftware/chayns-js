const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const BASE_PATH = path.resolve('./');

module.exports = {
    'entry': {
        'chayns': path.resolve(BASE_PATH, 'src/chayns.js'),
        'chayns.min': path.resolve(BASE_PATH, 'src/chayns.js')
    },
    'output': {
        'path': path.resolve(BASE_PATH, 'build'),
        'filename': '[name].js'
    },
    'mode': 'production',
    'devtool': 'hidden-source-map',
    'optimization': {
        'minimize': true,
        'nodeEnv': 'production',
        'minimizer': [
            new TerserPlugin({
                'test': /\.min\.js$/
            })
        ]
    },
    'module': {
        'rules': [
            {
                'test': /\.js$/,
                'use': 'babel-loader',
                'exclude': /node_modules/
            }
        ]
    },
    'plugins': [
        new webpack.DefinePlugin({
            '__DEV__': false
        }),
    ]
};
