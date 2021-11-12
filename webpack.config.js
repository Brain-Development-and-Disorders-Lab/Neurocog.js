const path = require('path');

module.exports = {
  name: 'source',
  mode: 'development',
  entry: {
    experiment: './src/Experiment.ts',
  },
  devtool: 'inline-source-map',
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
    libraryTarget: 'umd',
    library: 'Experiment',
    libraryExport: 'default',
    filename: '[name].bundle.js',
    umdNamedDefine: true,
    clean: true,
  },
};
