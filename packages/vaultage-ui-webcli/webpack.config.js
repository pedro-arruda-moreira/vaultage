const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const REPO_ROOT = __dirname;

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

    entry: {
        'main': [
            './src/main.ts'
        ]
    },

    output: {
        filename: '[name].js',
        path: path.resolve(REPO_ROOT, 'public/dist'),
        publicPath: '/dist',
        library: 'webcli'
    },

    devServer: {
        compress: true,
        port: 9000,
        hot: true,
        contentBase: 'public',
        allowedHosts: ['localhost']
    },

    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.less'],
        modules: ['node_modules', 'src', '..']
    },

    // Source maps support ('inline-source-map' also works)
    devtool: 'source-map',

    // Add the loader for .ts files.
    module: {
        rules: [{
            include: path.join(REPO_ROOT, '.'),
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader'
                },
            ]
        }]
    },

    plugins: [
        // Uncomment to analyze bundle
        // new (require('webpack-bundle-analyzer')).BundleAnalyzerPlugin(),

        new webpack.HotModuleReplacementPlugin({
            // Compute HMR chunks first
            multiStep: true
        }),
        new webpack.NamedModulesPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ],
};