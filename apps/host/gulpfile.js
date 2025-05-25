import { series } from 'gulp';
import { deleteAsync } from 'del';
import { exec } from 'child_process';

function cleanDist() {
  return deleteAsync(['dist'], { force: true });
}

function runWebpack(cb) {
  exec('pnpm run build', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
}

export default series(cleanDist, runWebpack);
