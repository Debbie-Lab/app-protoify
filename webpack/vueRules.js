
module.exports = function (node=false) {
  return {
    test: /\.vue$/,
    exclude: /node_modules/,
    use: {
      loader: 'vue-loader',
      options: {},
    },
  }
}

