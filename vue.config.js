module.exports = {
  transpileDependencies: [],
  devServer: {
    port: 8099,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    },
    // 适配webpack-dev-server v3.x版本的配置
    open: false,
    hot: true,
    // 旧版本使用disableHostCheck代替allowedHosts
    disableHostCheck: true,
    // 移除不兼容的配置项
    before: (app) => {
      console.log('正在启动前端服务，端口固定为8099...');
    }
  },
  // 防止Node.js堆内存溢出
  configureWebpack: {
    performance: {
      hints: false
    }
  }
} 