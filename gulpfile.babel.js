import gulp from 'gulp';
import gulp_pug from 'gulp-pug';
import ws from 'gulp-webserver';
import gimage from 'gulp-image';
import gulp_sass from 'gulp-sass';
import node_sass from 'node-sass';
import autoPrefixer from 'gulp-autoprefixer';
import miniCss from 'gulp-csso';
import brom from "gulp-bro";
import babelify from "babelify";

import {deleteAsync} from 'del';

const sass = gulp_sass(node_sass);

const routes = {
    pug: {
        watch:"src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        src:"src/scss/style.scss",
        dest: "build/css",
        watch: "src/scss/**/*.scss"
    },
    js: {
        src:"src/js/main.js",
        watch: "src/js/**/*.js",
        dest:"build/js"
    }
}

// pug to html
const pug = () => gulp.src(routes.pug.src).pipe(gulp_pug()).pipe(gulp.dest(routes.pug.dest));

//clean build folder
const clean = async () => await deleteAsync(["build"]);

const styles = () => gulp.src(routes.scss.src).pipe(sass().on("error", sass.logError)).pipe(autoPrefixer()).pipe(miniCss()).pipe(gulp.dest(routes.scss.dest));

const webserver = () => gulp.src("build").pipe(ws({livereload:true, open:true}));
const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.scss.watch, js);
}

const img = () => gulp.src(routes.img.src).pipe(gimage()).pipe(gulp.dest(routes.img.dest));

const js = () => gulp.src(routes.js.src).pipe(brom({
    transform: [
        babelify.configure({presets: ["@babel/preset-env"]}),
        ["uglifyify", {global:true}]
    ]
    }).pipe(gulp.dest(routes.js.dest))
);

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);