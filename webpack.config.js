let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    mode: "production",
    entry: "./src/index.js",
    // externals:{'vue': 'Vue'},
    output: {
        path: path.resolve(__dirname, `./dist`),
        filename: "bloodCat",
        libraryTarget: 'umd',//'commonjs',
        library:'bloodCat'
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        loader: require.resolve('babel-loader'),
                        options: {
                            presets: [
                                '@babel/preset-env',
                                [
                                    '@babel/preset-react',
                                    {
                                        pragma: 'Omi.h',
                                        pragmaFrag: 'Omi.h.f'
                                    }
                                ]
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                [
                                    '@babel/plugin-proposal-decorators',
                                    {
                                        legacy: true
                                    }
                                ],
                                '@babel/plugin-proposal-function-bind',
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-syntax-dynamic-import'
                            ],
                            cacheDirectory: true
                        }
                    },
                    {
                        test: /[\\|\/]_[\S]*\.css$/,
                        use: ['to-string-loader', 'css-loader']
                    },
                    {
                        test: /[\\|\/]_[\S]*\.less$/,
                        use: ['to-string-loader', 'css-loader', 'less-loader']
                    },
                    {
                        test: /\.scss$/,
                        use: [{
                            loader: "css-loader" // translates CSS into CommonJS
                        }, {
                            loader: "sass-loader" // compiles Sass to CSS
                        }]
                    },
                    {
                        test: /\.less$/,
                        use: ['style-loader', 'css-loader', 'less-loader']
                    },
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9' // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009'
                                        })
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    // 插件
    plugins: [
        // new UglifyJsPlugin({
        //     uglifyOptions: {
        //         /* 自动清除console*/
        //         compress: {
        //             // warnings: false, // 若打包错误，则注释这行
        //             drop_debugger: true,
        //             drop_console: true,
        //             pure_funcs: ['console.log']
        //         }
        //     },
        //     sourceMap: false,
        //     parallel: true
        // }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};
