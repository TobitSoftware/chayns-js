import webpack from 'webpack';
import path from 'path';

const BASE_PATH = path.resolve('./');

export default {
    entry: {
        'chayns': path.resolve(BASE_PATH, "src/chayns"),
        'chayns.min': path.resolve(BASE_PATH, "src/chayns")
    },
    resolve: {
        extensions: [
            "",
            ".js"
        ]
    },
    output: {
        path: path.resolve(BASE_PATH, "build"),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'hidden-source-map',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            },
            __DEV__: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};