const gulp = require('gulp');
const path = require('path');
const bs = require('browser-sync').create('main');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('../../webpack/webpack.config.dev');

gulp.task('watch', ['build'], function() {
    webpackConfig.watch = true;

    bs.init({
        server: 'core',
        // Use this for our projects, with the port the project uses.
        // proxy: 'localhost:8111',
    }, function() {
        webpack(webpackConfig).watch({}, (err, stats) => {
            const hasErrors = err || stats.hasErrors();
            if (err) {
                console.error(err.stack || err);

                if (err.details) {
                    console.error(err.details);
                }

                bs.notify(err.message, 10000);
            } else {
                const info = stats.toJson();

                if (stats.hasErrors()) {
                    bs.notify(info.errors[0].split('\n\n')[0], 10000);
                }

                if (stats.hasWarnings()) {
                    bs.notify(info.warnings[0], 10000);
                }

                console.log(stats.toString(webpackConfig.stats));

                if (!hasErrors && bs.active) {
                    bs.reload(path.join(webpackConfig.output.path, '**', '*.js'));
                }
            }
        });
    });

    gulp.watch(path.join(config.paths.views, '**', '*.html'), bs.reload);
    gulp.watch(path.join(config.paths.sass, '**', '*.scss'), ['css']);
    gulp.watch(path.join(config.paths.svg, '**', '*.svg'), ['svg']);
});
