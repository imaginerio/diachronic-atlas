const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    app: './src/index.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.js',
    library: 'diachronic-atlas',
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM',
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
