const { series, parallel, watch } = require('gulp');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const appsDir = path.resolve('./apps');
const cliDir = path.resolve('./packages/dev-cli');

function getAppDirs() {
  return fs.readdirSync(appsDir).filter((dir) => {
    const fullPath = path.join(appsDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });
}

function buildApp(appName) {
  return async function buildAppTask() {
    const cwd = path.join(appsDir, appName);
    console.log(`🔧 Building ${appName}...`);
    await execAsync('pnpm gulp', { cwd, stdio: 'inherit' });
    console.log(`✅ Done: ${appName}`);
  };
}

async function buildCli() {
  console.log('🔧 Building CLI...');
  await execAsync('pnpm run build', { cwd: cliDir, stdio: 'inherit' });
  console.log('✅ CLI build complete');
}

function watchCli() {
  console.log('👀 Watching CLI for changes...');
  return watch(
    ['src/**/*.ts'],
    { cwd: cliDir },
    series(buildCli)
  );
}

const buildAllApps = parallel(...getAppDirs().map(buildApp));

exports.default = series(buildAllApps);
exports.cli = series(buildCli);
exports.watch = watchCli;
