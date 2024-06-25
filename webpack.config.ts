import { Configuration } from "webpack";
import * as path from "path";
import CopyPlugin from "copy-webpack-plugin";
const GasPlugin = require("gas-webpack-plugin");

const config: Configuration = {
  entry: "./src/main.ts",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.join(__dirname, "dist"),
    clean: true,
  },
  experiments: {
    outputModule: true,
  },
  devtool: false,
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new GasPlugin(),
    new CopyPlugin({
      patterns: [{ from: "./src/appsscript.json" }],
    }),
  ],
};

export default config;
