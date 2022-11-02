import gulp from 'gulp';
import gulp_pug from 'gulp-pug';
import ws from 'gulp-webserver';
import {deleteAsync} from 'del';

const routes = {
    pug: {
        src: "src/*.pug",
        //src: "src/**/*.pug"
        dest: "build"
    }
}

// pug to html
const pug = () => gulp.src(routes.pug.src).pipe(gulp_pug()).pipe(gulp.dest(routes.pug.dest));

//clean build folder
const clean = async () => await deleteAsync(["build"]);

const webserver = () => gulp.src("build").pipe(ws({livereload:true, open:true}));

const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);
const postDev = gulp.series([webserver])

export const dev = gulp.series([prepare, assets, postDev]);