const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let sslCert;
let sslKey;
try {
    sslCert = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.crt'));
    sslKey = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.key'));
} catch (err) {
    sslCert = undefined;
    sslKey = undefined;
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
    'devtool': 'cheap-module-eval-source-map',
    'devServer': {
        'host': '0.0.0.0',
        'port': 8080,
        'disableHostCheck': true,
        'historyApiFallback': true,
        'hot': true,
        'https': !!(sslCert && sslKey),
        'cert': sslCert,
        'key': sslKey
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
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
