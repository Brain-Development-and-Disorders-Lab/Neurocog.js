const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const source = {
  name: 'source',
  mode: 'development',
  entry: {
    main: './src/main.ts',
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Task Name',
    }),
  ],
  devServer: {
    contentBase: [
      // Output path
      path.join(__dirname, 'built'),
      // Assets path
      path.join(__dirname, 'src/assets'),
    ],
    // Required public path for assets
    contentBasePublicPath: '/assets',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, './built'),
    filename: '[name].bundle.js',
    clean: true,
  },
};

const examples = {
  name: 'examples',
  mode: 'development',
  entry: {
    main: './examples/main.ts',
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Example Tasks',
    }),
  ],
  devServer: {
    contentBase: [
      // Output path
      path.join(__dirname, 'built'),
      // Assets path
      path.join(__dirname, 'examples/assets'),
    ],
    // Required public path for assets
    contentBasePublicPath: '/assets',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, './built'),
    filename: '[name].bundle.js',
    clean: true,
  },
};

module.exports = [
  source,
  examples,
];
