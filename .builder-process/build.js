process.env.NODE_ENV = 'production';

const { say } = require('cfonts');
const chalk = require('chalk');
const del = require('del');
const fs = require('fs');
const packager = require('electron-packager');
const Multispinner = require('multispinner');


const buildConfig = require('./config').building

const doneLog = chalk.bgGreen.white(' DONE ') + ' '
const errorLog = chalk.bgRed.white(' ERROR ') + ' '
const okayLog = chalk.bgBlue.white(' OKAY ') + ' '
const isCI = process.env.CI || false

if (process.env.BUILD_TARGET === 'clean') clean()
else build()

function clean () {
  del.sync(['builds/*', '!.gitkeep'])
  console.log(`\n${doneLog}\n`)
  process.exit()
}

function build () {
    greeting()

    // clean builds directory
    del.sync(['builds/*', '!.gitkeep'])

    console.log(`${okayLog}take it away ${chalk.yellow('electron-packager')}\n`)
    bundleApp()
}

function bundleApp () {
  packager(buildConfig)
    .then((appPaths) => {
      console.log(`\n${doneLog}\n`)
      console.log(appPaths)

      console.log('\n\x1b[34mDONE\n\x1b[0m')
    })
    .catch((err) => {
      console.log(`\n${errorLog}${chalk.yellow('`electron-packager`')} says...\n`)
      console.log(err + '\n')
    });
}


function greeting () {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 85) text = 'lets-build'
  else if (cols > 60) text = 'lets-|build'
  else text = false

  if (text && !isCI) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    })
  } else console.log(chalk.yellow.bold('\n  lets-build'))
  console.log()
}