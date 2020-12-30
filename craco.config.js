module.exports = {
  webpack: {
    configure: (config) => {
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'workerize-loader' }
      })
      return config
    }
  }
}