module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?'/h5/shop':'/',//history模式用/  hash 模式用./
    devServer: {
        disableHostCheck: true,
        port: 8081
    },
    lintOnSave: false,

    productionSourceMap: false,
    // configureWebpack:{
    //     resolve:{
    //         alias:{
    //             'assets':'@/assets',
    //             'components':'@/components',
    //             'network':'@/network',
    //             'views':'@/views',
    //             '@':'/src'
    //         }
    //     }
    // }
    
};
