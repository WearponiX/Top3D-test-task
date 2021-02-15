"use strict";
const gulp = require("gulp");
const {src, series} = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const del = require("del");
const csso = require("gulp-csso");

function clean() {
  return del("build");
};

function copy() {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
};

function css() {
  return src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
};

function html() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
};

function createServer() {
  server.init({
    server: "build/"
  });
  gulp.watch("source/less/**/*.less", series(css));
  gulp.watch("source/*.html", series(html, refresh));
};

function refresh(done) {
  server.reload();
  done();
};

exports.build = series(clean, copy, css, html);
exports.start = series(clean, copy, css, html, createServer);
