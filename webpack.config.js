const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')

/*
    production:

    web      ---------->   dist/preload.min.js 
 */
const ENV = process.env.NODE_ENV;

let config = {
    entry: path.join(__dirname, './src/index.js'),

    mode: 'development',

    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }]
        }]
    },

    plugins: []
}

/* 测试node模块 */
if (ENV === 'development') {
    config.entry = path.join(__dirname, './test/module/test.js')
    config.output = {
        path: path.join(__dirname, './test/module'),
        filename: 'preload.bundle.js'
    }

    config.devServer = {
        contentBase: path.join(__dirname, './test/module'),
        host: '0.0.0.0',
        port: '9000'
    }

    config.plugins.push(new htmlPlugin({
        filename: 'index.html',
        template: path.join(__dirname, './test/templates/module.ejs')
    }))
}


/* web文件测试 */
if (ENV === 'test') {
    config.devtool = '#cheap-module-source-map'
    config.output = {
        path: path.join(__dirname, './test/web/'),
        filename: 'preload.js',
        // 不定义libraryTarget会导致文件使用Commondjs规范，不能在浏览器中使用
        library: 'Preload',
        libraryTarget: 'umd'
    }

    config.devServer = {
        contentBase: path.join(__dirname, './test/web'),
        host: '0.0.0.0',
        port: '9000'
    }

    config.plugins.push(new htmlPlugin({
        filename: 'index.html',
        template: path.join(__dirname, './test/templates/template.ejs')
    }))
}

/* 生产环境 */
if (ENV === 'production') {
    config.mode = 'production'

    config.output = {
        path: path.join(__dirname, './dist/'),
        filename: 'preload.min.js',
        // 不定义libraryTarget会导致文件使用Commondjs规范，不能在浏览器中使用
        library: 'Preload',
        libraryTarget: 'umd'
    }
}

module.exports = config