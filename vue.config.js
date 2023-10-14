//打包配置文件
module.exports = {
    publicPath: '/',
    //1.为文件配置别名
    configureWebpack: {
        resolve: {
            alias: {
                'assets': "@/assets",
                'common': "@/common",
                'components': '@/components',
                'network': '@/network',
                'views': '@/views'
            }
        },

    },
    //2.配置跨域
    devServer: {
        proxy: {
          //名字可以自定义
          '/api': {
            target: 'http://127.0.0.1:80',//设置你调用的接口域名和端口号（目标IP：端口）
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      }
}