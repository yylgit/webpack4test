var webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = {
  mode: 'development',
  devtool: '',
  entry: {
    main: path.join(__dirname, './main.js')
  },
  output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          name: "vendor",
          priority: 10,
        },
        common: {
          name: 'common',
          chunks: "all",
          minChunks: 2,
          minSize:0,
          enforce: true,
          priority: 9
        }
      }
    },
    runtimeChunk: {
      name: "manifest"
    }
  }
}


webpack(config, function(err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n')
})