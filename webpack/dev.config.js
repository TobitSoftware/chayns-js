const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let sslKey = path.join(__dirname, 'ssl', 'ssl.key');
let sslCert = path.join(__dirname, 'ssl', 'ssl.crt');
let serverType = 'https';

if (!fs.existsSync(sslKey) || !fs.existsSync(sslCert)) {
    sslKey = undefined;
    sslCert = undefined;
    serverType = 'http';
}

const BASE_PATH = path.resolve('./');

module.exports = {
    'entry': [
        path.resolve(BASE_PATH, 'src/chayns.js')
    ],
    'output': {
        'path': path.resolve(BASE_PATH, 'build'),
        'filename': 'chayns.js'
    },
    'mode': 'development',
    'devtool': 'eval-cheap-module-source-map',
    'devServer': {
        'allowedHosts': 'all',
        'host': '0.0.0.0',
        'port': 8080,
        'historyApiFallback': true,
        'hot': true,
        'server': {
            'type': serverType,
            'options': {
                'key': sslKey,
                'cert': sslCert
            }
        }
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
            '__DEV__': true
        })
    ]
};
