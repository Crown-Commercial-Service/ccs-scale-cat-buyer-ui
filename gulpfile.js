const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const plumber = require('gulp-plumber')
const livereload = require('gulp-livereload')
const sass = require('gulp-sass')(require('sass'))
const path = require('path')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const fs = require('fs')
const del = require('del');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const minifyCSS = require('gulp-clean-css');

const repoRoot = path.join(__dirname, '/')
const ccsFrontendToolkitRoot = path.join(repoRoot, 'node_modules/govuk_frontend_toolkit/stylesheets')
const GOVUKROOT = path.join(repoRoot, 'node_modules/govuk-frontend/govuk')
const ccsElementRoot = path.join(repoRoot, 'node_modules/govuk-elements-sass/public/sass')
const ccsFrontendRoot = path.join(repoRoot, 'node_modules/ccs-frontend-kit/Assets/styles')
const appDirectory = `./src/main/common/components/imported`

const assetsDirectory = './src/main/public/assets'

const govUKDIrectory = './src/main/views/govuk'
const stylesheetsDirectory = `${assetsDirectory}/styles`
const govUkFronendStylesheets = `${stylesheetsDirectory}/govuk-frontend`

gulp.task('sass-ccs-frontend', (done) => {
  gulp.src(ccsFrontendRoot + '/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(`${stylesheetsDirectory}`))

  gulp.src(govUkFronendStylesheets + '/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(govUkFronendStylesheets))
    .pipe(livereload())
  done()
})

gulp.task('copy-files', (done) => {
  copyCcsTemplate()
  done()
})



function copyCcsTemplate() {
  gulp.src([
    './node_modules/ccs-frontend-kit/Assets/scripts/**/*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/scripts`))

  gulp.src([
    './node_modules/ccs-frontend-kit/Assets/images/**/*',
    './node_modules/ccs-frontend-kit/Assets/images/*.*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/images`))

  gulp.src([
    './node_modules/ccs-frontend-kit/Assets/fonts/**/*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/fonts/`))

  gulp.src([
    './node_modules/ccs-frontend-kit/Assets/svg/**/*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/svg/`))

  gulp.src([
    './src/main/assets/img/**/*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/images`))

  gulp.src([
    './src/main/assets/scss/**/*'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/styles`))
}


gulp.task('styles', () => {
  return gulp.src('src/main/public/assets/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('src/main/public/assets/styles/'));
});

gulp.task('clean', () => {
  return del([
      'src/main/public/assets/styles/**/*',
      '!src/main/public/assets/styles/application.css',
      '!src/main/public/assets/styles/additional.css',
      '!src/main/public/assets/styles/bundle.min.css',
      '!src/main/public/assets/styles/custom.css',
      '!src/main/public/assets/styles/govuk_fac_style.css'
  ]);
});


gulp.task('pack-scripts', () => {
  return gulp.src(['src/main/public/assets/scripts/app.js', 'src/main/public/assets/scripts/all.js', 'src/main/public/assets/scripts/cookies/*.js', 'src/main/public/assets/scripts/dialog/*.js', 'src/main/public/assets/scripts/pagination/*.js', 'src/main/public/assets/scripts/session/*.js', 'src/main/public/assets/scripts/validations/*.js', 'src/main/public/assets/scripts/application.js'])
        .pipe(concat('bundle.js'))
        .pipe(minify())
        .pipe(gulp.dest('src/main/public/assets/scripts'));
});

gulp.task('pack-styles', () => {
  return gulp.src(['src/main/public/assets/styles/application.css', 'src/main/public/assets/styles/custom.css', 'src/main/public/assets/styles/govuk_fac_style.css'])
        .pipe(concat('bundle.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('src/main/public/assets/styles'));
});

gulp.task('default',
  gulp.series(
    gulp.parallel(
      'clean',
      'styles'
    )
  )
)