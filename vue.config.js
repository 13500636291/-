module.exports = {
    // 将部署应用程序的基本URL。
    baseUrl: '/front/boss/',
    assetsDir: "assets",
    lintOnSave: false,
    // 源映射
    productionSourceMap: false,
    devServer: {
        port: 81, // 端口号
        host: 'school-dev.inansy.com',
        https: false,
        open: true, //配置自动启动浏览器
    }
}