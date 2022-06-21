const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  target: ["web"],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    library: {
      type: "umd",
    },
    path: path.resolve(__dirname, "dist"),
  },
};
