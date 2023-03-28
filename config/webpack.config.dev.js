const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin")


module.exports = {
    mode: 'development',
    entry: {
       main: "./src/app.js"
    },
    output: {
        filename: "./js/app-[contenthash:6].js",
        path: path.resolve(__dirname, '../', 'dev-build'),
        assetModuleFilename: 'images/[name][ext][query]'
    },
    module: {
        rules: [
            {
                test: /\.txt$/i,
                use: "raw-loader"
            },

            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(scss|sass)$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(jpg|png|svg|gif|jpeg)$/,
                dependency: { not: ['url'] },
                type: 'javascript/auto',
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images',
                    },
                }, 
                {
                    loader: 'image-webpack-loader',
                    options:{
                        mozjpeg: {
                            quality: 75,
                            progressive: true
                        }
                    }
                }]
            },
            {
                test: /\.(js)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        "@babel/preset-env"
                    ],
                    plugins: [
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: false,
            template: "src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: './style-[contenthash:6].css'
        }),

        new CopyPlugin({
            patterns: [
                { from: "src/images", to: "images" },
            ],
        })
    ],

    devServer: {
        hot: true,
    }
}