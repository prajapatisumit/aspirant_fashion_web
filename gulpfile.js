var gulp = require('gulp');

var url = require('url');
var proxy = require('proxy-middleware');
var browserSync = require('browser-sync');
var csspath = 'css/style.css';

// var watchpaths = {
//   css: ['csspath']
// };
var paths = {
  css: ['./**/*.css', '!./node_modules/**/*', 'index.html']
};

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  var proxyOptions = url.parse('http://localhost:3000/secret-api');
  proxyOptions.route = '/api';
  // requests to `/api/x/y/z` are proxied to `http://localhost:3000/secret-api`

  browserSync({
    open: true,
    port: 3000,
    server: {
      baseDir: "./",
      middleware: [proxy(proxyOptions)]
    }
  });
});

// Stream the style changes to the page
gulp.task('reload-css', function() {
  gulp.src(paths.css)
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(paths.css, ['reload-css']);
});

// Default Task
// Default Task
gulp.task('default', ['browser-sync', 'watch']);
// gulp.task('reload-css', ['browser-sync', 'watch']);
