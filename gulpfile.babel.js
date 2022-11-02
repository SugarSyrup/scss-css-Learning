import gulp from 'gulp';
import gulp_pug from 'gulp-pug';
import ws from 'gulp-webserver';
import {deleteAsync} from 'del';

const routes = {
    pug: {
        watch:"src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    }
}

// pug to html
const pug = () => gulp.src(routes.pug.src).pipe(gulp_pug()).pipe(gulp.dest(routes.pug.dest));

//clean build folder
const clean = async () => await deleteAsync(["build"]);

const webserver = () => gulp.src("build").pipe(ws({livereload:true, open:true}));
const watch = () => {
    gulp.watch(routes.pug.watch, pug);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);