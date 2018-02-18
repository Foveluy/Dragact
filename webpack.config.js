const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: [
        'react-hot-loader/patch',
        'webpack/hot/only-dev-server',
        './src/index.tsx'
    ],
    output: {
        path: resolve(__dirname, 'build'),//打包后的文件存放的地方
        filename: "react-dragger-layout.js",//打包后输出文件的文件名
        publicPath: "/"
    },
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        hot: true,
        publicPath: '/',
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'//在webpack-dev中不能使用--hot
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
    devtool: "cheap-eval-source-map",
};