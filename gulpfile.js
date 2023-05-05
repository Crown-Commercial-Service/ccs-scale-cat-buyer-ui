const { dest, parallel, series, src, watch } = require('gulp')
const del = require('del')
const livereload = require('gulp-livereload');

const concat = require('gulp-concat')
const minify = require('gulp-minify')
const minifyCSS = require('gulp-clean-css')

const packFonts = () => {
  return src(
    [
      // Fonts from packages
      './node_modules/ccs-frontend-kit/Assets/fonts/*',
      './node_modules/govuk-frontend/govuk/assets/fonts/*'
    ]
  )
    .pipe(dest('src/main/public/assets/fonts'))
}

const packImages = () => {
  return src(
    [
      // Images from packages
      './node_modules/ccs-frontend-kit/Assets/images/*',
      './node_modules/govuk-frontend/govuk/assets/images/*',
      // Images from the project
      'src/main/assets/images/*',
    ]
  )
    .pipe(dest('src/main/public/assets/images'))
}

const packSvg = () => {
  return src(
    [
      // SVG from packages
      './node_modules/ccs-frontend-kit/Assets/svg/*',
      // SVG from the project
      'src/main/assets/svg/*',
    ]
  )
    .pipe(dest('src/main/public/assets/svg'))
}

const packFiles = () => {
  return src(
    [
      // Files from the project
      'src/main/assets/files/*',
    ]
  )
    .pipe(dest('src/main/public/assets/files'))
}

const packScripts = () => {
  return src(
    [
      // Scripts from packages
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/objectFitPolyfill/dist/objectFitPolyfill.min.js',
      './node_modules/ccs-frontend-kit/Assets/scripts/app.js',
      // Scripts from the project
      'src/main/assets/scripts/all.js',
      'src/main/assets/scripts/cookies/*.js',
      'src/main/assets/scripts/dialog/*.js',
      'src/main/assets/scripts/pagination/*.js',
      'src/main/assets/scripts/session/*.js',
      'src/main/assets/scripts/validations/*.js',
      'src/main/assets/scripts/application.js'
    ]
  )
    .pipe(concat('bundle.js'))
    .pipe(minify())
    .pipe(dest('src/main/public/assets/scripts'))
}

const packStyles = () => {
  return src(
    [
      'src/main/assets/styles/application.css',
      'src/main/assets/styles/custom.css',
      'src/main/assets/styles/govuk_fac_style.css'
    ]
  )
    .pipe(concat('bundle.min.css'))
    .pipe(minifyCSS())
    .pipe(dest('src/main/public/assets/styles'))
}

const cleanStatic = () => {
  return del([
    'src/main/public/assets/files/**/*',
    'src/main/public/assets/fonts/**/*',
    'src/main/public/assets/images/**/*',
    'src/main/public/assets/svg/**/*',
  ])
}

const cleanScripts = () => {
  return del(['src/main/public/assets/scripts/**/*'])
}

const cleanStyles = () => {
  return del(['src/main/public/assets/styles/**/*'])
}

const watchScripts = () => {
  return packScripts()
    .pipe(livereload())
}

const watchStyles = () => {
  return packStyles()
    .pipe(livereload())
}

const watchAssets = () => {
  livereload.listen(
    {
      port: 45729
    }
  )
  watch(
    [
      'src/main/assets/scripts/**/*.js'
    ],
    series(
      cleanScripts,
      watchScripts
    )
  )
  watch(
    [
      'src/main/assets/styles/**/*.css'
    ],
    series(
      cleanStyles,
      watchStyles
    )
  )
}

exports.build = series(
  parallel(
    cleanStatic,
    cleanScripts,
    cleanStyles,
  ),
  parallel(
    packFonts,
    packImages,
    packSvg,
    packFiles,
    packScripts,
    packStyles
  )
)
exports['watch-assets'] = watchAssets
exports.default = exports.build
