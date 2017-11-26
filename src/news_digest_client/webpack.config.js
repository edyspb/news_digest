var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'build', 'public'),
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'env', 'react']
                    }
                },
                {
                    test: /\.css$/,
                    loaders: ["style-loader", "css-loader"]
                }
            ]
        },
        stats: {
            colors: true
        },
        target: 'web',
        plugins: [new HtmlWebpackPlugin({
            title: 'News digest',
            filename: 'index.html',
            template: __dirname + '/templates/index.html'
        })]
    },
];
