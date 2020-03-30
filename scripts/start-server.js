const webpack = require('webpack');
const config = require('../config/webpack.dev.server');

webpack(config, (err, stats) => {
    if (err)
        console.error(err);
});