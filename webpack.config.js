const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Webpack utilise ce module Node.js pour travailler avec les dossiers.
const path = require('path');
const webpack = require('webpack');
const Dotenv = require("dotenv-webpack");
const { watch } = require("fs");

// Ceci est la configuration principale de ton projet.
// Ici, tu peux écrire les différentes options que tu souhaites, et dire à Webpack quoi faire.
module.exports = (env) => {
  console.log("ENV reçu:", env.NODE_ENV);
  return {
    // Ceci est le chemin vers le "point d'entrée" de ton app.
    // C'est depuis ce fichier que Webpack commencera à travailler.
    entry: './src/index.js',

    // C'est ici qu'on dit à Webpack où mettre le fichier résultant avec tout ton JS.
    output: {
      // Le chemin relatif au dossier courant (la racine du projet)
      path: path.resolve(__dirname, 'dist'),
      // Le nom du fichier de ton bundle JS
      filename: 'bundle.js',
      // L'URL relatif au HTML pour accéder aux assets de l'application. Ici,
      // le HTML est situé à la racine du projet, donc on met une chaîne vide.
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.js$/, // Pour ton JS
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        // On le met en tout premier, afin qu'il soit exécuté en dernier,
        // une fois que tous les changements souhaités sont appliqués à notre CSS.
        {
          test: /\.(sa|sc|c)ss$/, // Pour le SCSS/CSS
          use: [
            MiniCssExtractPlugin.loader, // extrait le CSS dans bundle.css
            "css-loader",                // gère les @import et url()
            "postcss-loader",            // autoprefixer, minification éventuelle
            {
              loader: "sass-loader",     // compile le SCSS en CSS
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i, // Pour les images
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i, // Pour les polices
          type: 'asset/resource',
        },


      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'bundle.css',
      }),
      new Dotenv({
        path: './.env', // Path to .env file (this is the default)
        safe: false, // load .env.example (defaults to "false" which does not use dotenv-safe)
        allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (defaults to false)
        systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
        silent: false, // hide any errors
        defaults: false // load '.env.defaults' file (defaults to "false" which does not use dotenv-defaults)
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
      hot: true, // active HMR
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/, // Ignore les fichiers inutiles
      aggregateTimeout: 300,  // Délai avant recompilation
      poll: 1000,             // Vérification des changements (ms)
    },

    // Par défaut, le mode de Webpack est "production". En fonction de ce qui est
    // écrit ici, tu pourras appliquer différentes méthodes dans ton bundle final.
    // Pour le moment, nous avons besoin du mode "développement", car nous n'avons,
    // par exemple, pas besoin de minifier notre code.

    mode: env.NODE_ENV === "production" ? "production" : "development"
  };
};