const {task, parallel, dest, src} = require('gulp')
const umd = require('gulp-umd')
const babel = require('gulp-babel')

task('umd-hybrid', function() {
  return src('src/esmHybridCjs.js').pipe(umd()).pipe(dest('dist/gulp-umd'))
})

task('umd-cjs', function() {
  return src('src/testForCjs.js').pipe(umd()).pipe(dest('dist/gulp-umd'))
})

task('umd-esm', function() {
  return src('src/testForEsm.js').pipe(umd()).pipe(dest('dist/gulp-umd'))
})

task('babel', function(){
  return src('src/esmHybridCjs.js').pipe(babel({
    presets: [
      ['@babel/preset-env', {
        modules: 'umd'
      }]
    ]
  })).pipe(dest('dist/babel-umd'))
})

task('babel-cjs', function(){
  return src('src/esmHybridCjs.js').pipe(babel({
    presets: [
      ['@babel/preset-env', {
        modules: 'cjs'
      }]
    ]
  })).pipe(dest('dist/cjs'))
})

task('babel-esm', function(){
  return src('src/esmHybridCjs.js').pipe(babel({
    presets: [
      ['@babel/preset-env', {
        modules: false,
        targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      }]
    ]
  })).pipe(dest('dist/esm'))
})

// exports.default = defaultTask
task('default', parallel('umd-cjs', 'umd-esm', 'umd-hybrid', 'babel', 'babel-cjs', 'babel-esm'))
// task('default', parallel('umd-cjs', 'umd-esm'))