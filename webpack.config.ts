import * as path from 'path';
import * as webpack from 'webpack';

import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import * as TerserPlugin from 'terser-webpack-plugin';

import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import * as CopyPlugin from 'copy-webpack-plugin';
import * as CompressionPlugin from 'compression-webpack-plugin';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import type {Manifest} from 'webpack-manifest-plugin';

import type * as devServer from 'webpack-dev-server';

const isProduction = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const outputDirectory = path.resolve(__dirname, 'dist');
const publicDirectory = path.resolve(__dirname, 'public');

const config: webpack.Configuration | {devServer?: devServer.Configuration} = {
  mode: isDev ? 'development' : 'production',
  devServer: {
    compress: true,
    port: process.env.PORT || 8080,
  },

  // Can be extended with other entry points.
  entry: ['./src/index.ts'],
  output: {
    path: outputDirectory,

    // We want to hash filenames in production, so changed files
    // would have a different name and won't be cached.
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',

    // Needed if we use code splitting.
    chunkFilename: isDev ? '[name].js' : '[name].[contenthash:8].chunk.js',

    publicPath: '/',
  },

  // Fail out on the first error instead of tolerating it.
  bail: !isDev,

  // This option controls if and how source maps are generated.
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',

  optimization: {
    minimize: isProduction,
    minimizer: [new HtmlMinimizerPlugin(), new CssMinimizerPlugin(), new TerserPlugin()],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  // This allows us to write 'import filename' without extension.
  resolve: {
    extensions: ['.js', '.ts', '.glsl', '.vert', '.frag'],
  },
  module: {
    // Makes missing exports an error instead of warning.
    strictExportPresence: true,

    rules: [
      {
        // Ignore Declaration typescript files.
        exclude: /\.d\.ts/,
      },
      {
        test: /\.worker\.[tj]s$/,
        loader: 'worker-loader',
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              modules: {
                auto: true,
                localIdentName: isDev ? '[name]__[local]_[contenthash:8]' : '[hash:base64]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
        },
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10 * 1024,
              noquotes: true,
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [{removeTitle: true}, {mergePaths: true}],
              multipass: true,
            },
          },
        ],
      },
      {
        test: /\.(glsl|vert|frag)$/,
        use: 'raw-loader',
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  plugins: [
    // Pass environment variables that are used in the code.
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    // Show progess when it's a production mode.
    !isDev && new webpack.ProgressPlugin(),
    // Clean output folder before a production build.
    !isDev && new CleanWebpackPlugin(),

    // Copy content to the output directory without processing it.
    new CopyPlugin({
      patterns: [
        {
          from: publicDirectory,
          globOptions: {
            ignore: ['**/index.html'],
          },
          to: outputDirectory,
          noErrorOnMissing: true,
        },
      ],
    }),

    // Add scripts to the final HTML
    new HtmlWebpackPlugin({
      inject: true,
      template: `html-loader!${path.resolve(publicDirectory, 'index.html')}`,
      filename: 'index.html',
      minify: isProduction
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
        : undefined,
    }),

    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file.
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/',
      generate: (seed, files) => {
        const manifest: Manifest = {};
        files.forEach(file => {
          manifest[file.name] = file.path;
        });
        return manifest;
      },
    }),

    // Updates modules while an application is running, without a full reload.
    isDev && new webpack.HotModuleReplacementPlugin(),

    // TODO(ts): The current @types/compression-webpack-plugin is still targeting webpack@4, for now we just as any it.
    isProduction &&
      (new CompressionPlugin({
        test: /\.(js|svg)$/,
        filename: '[path].br[query]',
        algorithm: 'brotliCompress',
        compressionOptions: {level: 11},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any),

    isProduction &&
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
        ignoreOrder: true,
      }),
  ].filter(Boolean),
};

export default config;
