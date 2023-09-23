const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js',]
    },
    entry: {
        'packages/connectedrp': './scripts/server',
        'client_packages': './scripts/client',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name]/index.js'
    },
    target: 'es6', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
};