const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config/webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const env = config.build.env;

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
        }),
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            sourceMap: true,
        }),
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
        }),
        new OptimizeCSSPlugin(),
        new HtmlWebpackPlugin({
            filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
            template: './src/client/index.html',
            favicon: './src/client/assets/images/favicon.png',
            chunks: ['manifest', 'vendor', 'pc'],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            chunksSortMode: 'dependency',
        }),
        new HtmlWebpackPlugin({
            filename: 'mobile.html',
            template: './src/client/index.html',
            favicon: './src/client/assets/images/favicon.png',
            chunks: ['manifest', 'vendor', 'mobile'],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            chunksSortMode: 'dependency',
        }),
        new HtmlWebpackPlugin({
            filename: 'next.html',
            template: './src/client/index.html',
            favicon: './src/client/assets/images/favicon.png',
            chunks: ['manifest', 'vendor', 'next'],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            chunksSortMode: 'dependency',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules'),
                ) === 0
            ),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor'],
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*'],
            },
        ]),
    ],
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                `\\.(${
                config.build.productionGzipExtensions.join('|')
                })$`,
            ),
            threshold: 10240,
            minRatio: 0.8,
        }),
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
