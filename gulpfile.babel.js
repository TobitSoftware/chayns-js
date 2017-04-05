import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import webpack from 'webpack';
import productionConfig from './webpack/prod.babel';

/**
 * Path to release-directory
 * @type {string} RELEAST_PATH
 */
const RELEAST_PATH = '',
	BUILD_PATH = './build/',
	PRERELEASE_PATH = '';

/**
 * Builds and deploys to release path.
 */
gulp.task('deploy:release', ['build'], () => {
	gulp.src(`${BUILD_PATH}*.*`)
		.pipe(gulp.dest(path.resolve(RELEAST_PATH, 'js')));
});

/**
 * Builds and deploys to QA path.
 */
gulp.task('deploy:qa', ['build'], () => {
	gulp.src(`${BUILD_PATH}*.*`)
		.pipe(gulp.dest(path.resolve(RELEAST_PATH, 'intern/qa/js')));
});

/**
 * Builds and deploys to LOCAL path.
 */
gulp.task('deploy:local', ['build'], () => {
	gulp.src(`${BUILD_PATH}*.*`)
		.pipe(gulp.dest(path.resolve(PRERELEASE_PATH, 'js')));
});

/**
 * Builds for production using webpack.
 */
gulp.task('build', (cb) => webpack(productionConfig).run((err, stats) => {
	gutil.log('[webpack:production]', stats.toString({
		'colors': true,
		'progress': true
	}));
	cb();
}));
