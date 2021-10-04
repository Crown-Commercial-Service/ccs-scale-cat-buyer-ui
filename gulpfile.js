const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const plumber = require('gulp-plumber')
const livereload = require('gulp-livereload')
const sass = require('gulp-sass')
const path = require('path')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const fs = require('fs')

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

gulp.task('default',
  gulp.series(
    gulp.parallel(
      'sass-ccs-frontend',
      'copy-files',
    )
  )
)