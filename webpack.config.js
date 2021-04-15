const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',

  entry: {
    app: './src/index.js',
  },
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.js',
    library: 'diachronic-atlas',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true,
  },
  target: 'node',
  devtool: 'source-map',
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  module: {
    rules: [
      {
        // Compile ES2015 using babel
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react'],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [{ loader: 'style-loader', options: { injectType: 'styleTag' } }, 'css-loader'],
      },
    ],
  },
};
