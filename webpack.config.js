require('dotenv').config();

var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var baseConfig = {
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/, //handle javascript files
        use: [{
          loader: 'babel-loader', //babel loader allows transpiling of javascript using Babel and webpack
          options: {
            "presets": [ [ "env" ] ],
            "plugins": [ "transform-es2015-destructuring", "transform-runtime", "es6-promise" ]
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/, //handle .sccs files
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' }) //create as a seperate css file, as required for server side rendering
      },
      {
        test: /\.(png|jpg|gif|svg|ttf)$/, //handle image and font files
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          publicPath: process.env.CDN_URL && process.env.NODE_ENV === 'production' ? `${process.env.CDN_URL}/dist/` : false
        }
      },
      {
        test: /\.vue$/,  //handle .vue files
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'js': 'babel-loader?presets[]=env'
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  }
};

//exporting 2 seperate webpack configurations. One for the browser; one for the node server.
let targets = [ 'web', 'node' ].map((target) => {
  let obj = webpackMerge(baseConfig, {
    target: target,
    entry: {
      app: target === 'web'
        ? process.env.NODE_ENV === 'development'
          ? [ `./src/${target}.entry.js`, 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000' ]
          : [ `./src/${target}.entry.js` ]
        : [ `./src/${target}.entry.js` ]
      ,
    },
    output: {
      filename: `${target}.bundle.js`,
      libraryTarget: target === 'web' ? 'var' : 'commonjs2'
    },
    module: {
      rules: [

      ]
    },
    plugins: target === 'web'
      ? process.env.NODE_ENV === 'development'
        ? [
            new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin("style.css")
          ]
        : [
            new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
            new webpack.optimize.UglifyJsPlugin({ sourceMap: true, compress: { warnings: false } }),
            new webpack.LoaderOptionsPlugin({ minimize: true }),
            new ExtractTextPlugin("style.css")
          ]
      : []
    ,
    devtool: target === 'web'
      ? process.env.NODE_ENV === 'development'
        ? '#eval-source-map'
        : '#source-map'
      : false
  });
  if (process.env.NODE_ENV === 'development' && target === 'web') {
    obj.module.rules[0].use.push({ loader: 'webpack-module-hot-accept' });
  }
  return obj;
});

module.exports = targets;
