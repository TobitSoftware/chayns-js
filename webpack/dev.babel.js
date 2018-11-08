import webpack from 'webpack';
import path from 'path';

const BASE_PATH = path.resolve('./');

export default {
    mode: 'development',
    entry: [
        "webpack/hot/dev-server",
        "webpack-dev-server/client?http://0.0.0.0:8000",
        path.resolve(BASE_PATH, "src/chayns")
    ],
    resolve: {
        extensions: [
            "",
            ".js"
        ]
    },
    output: {
        path: path.resolve(BASE_PATH, "build"),
        filename: "chayns.js"
    },
    devtool: "cheap-module-eval-source-map",
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
