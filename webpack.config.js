const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            handlebars: "handlebars/dist/handlebars.min.js"
        }
    },
    output: {
        filename: 'index.js',
        libraryTarget: "window",
        path: path.resolve(__dirname, 'lib'),
    },
};