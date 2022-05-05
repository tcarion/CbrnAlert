const path = require('path');
const dev = process.env.NODE_ENV === "dev"
// const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

let config = {
    devtool: 'eval',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    watch: true,
    optimization: {
        minimize: true,
    },
    plugins: [
        // new WebpackBundleAnalyzer(),
        // new UglifyJSPlugin()
    ]
}

if (!dev) {
    config.devtool = false;
    config.plugins.push(new UglifyJSPlugin());
    config.watch = false;
}

module.exports = config