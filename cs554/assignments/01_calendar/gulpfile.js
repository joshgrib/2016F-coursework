const gulp = require("gulp");
const gulpWatch = require("gulp");
const concatenate = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const autoPrefix = require("gulp-autoprefixer");
const gulpSASS = require("gulp-sass");

const cssFiles = "./public/css/source/**/*.css";
const sassFiles = "./public/css/source/sass/**/*.scss";
const vendorFiles = "./public/js/vendor/*.js";

gulp.task("sass", () => {
    gulp.src(sassFiles)
        .pipe(gulpSASS())
        .pipe(concatenate("sass-styles.min.css"))
        .pipe(autoPrefix())
        //.pipe(cleanCSS())
        .pipe(gulp.dest("./public/css/"));
});

gulp.task("css", () => {
    gulp.src(cssFiles)
        .pipe(concatenate("css-styles.min.css"))
        .pipe(autoPrefix())
        .pipe(cleanCSS())
        .pipe(gulp.dest("./public/css/"));
});

gulp.task("vendor", () => {
    return gulp
        .src(vendorFiles)
        .pipe(concatenate("vendor.js"))
        .pipe(gulp.dest("./public/js/"));
});

gulp.task("watch", () => {
    gulp.watch(cssFiles, ["css"]);
    gulp.watch(sassFiles, ["sass"]);
    gulp.watch(vendorFiles, ["vendor"]);
});

gulp.task("default", ["css", "sass", "vendor", "watch"]);
