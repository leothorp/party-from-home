const webpack = require('webpack');
const config = require('../config/webpack.server');

webpack(config, (err, stats) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false,
    }) + '\n\n'
  );

  if (stats.hasErrors()) {
    console.log('build finished with errors');
    process.exit(1);
  }
});
