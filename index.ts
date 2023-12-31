import * as fs from 'fs';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import run, { ExecFunction } from './scripts/init';

try {
  const wsDir: string = core.getInput('ws-dir');
  const bitToken = process.env.BIT_TOKEN;
  if (!bitToken) {
    throw new Error("Bit token not found");
  }
  const stdExec: ExecFunction = (command: string, options?: {cwd: string}): Promise<number> => exec(command, [], options);
  run(stdExec, bitToken, wsDir).then((): void => {
    // Set wsDir path for subsequent steps in GitHub Actions
    fs.appendFileSync(process.env.GITHUB_ENV as string, `WSDIR=${process.env.WSDIR}\n`);
    // Set Bit path for subsequent steps in GitHub Actions
    fs.appendFileSync(process.env.GITHUB_PATH as string, process.env.PATH as string);
    // Set org path for subsequent steps in GitHub Actions
    fs.appendFileSync(process.env.GITHUB_ENV as string, `ORG=${process.env.ORG}\n`);
    // Set scope path for subsequent steps in GitHub Actions
    fs.appendFileSync(process.env.GITHUB_ENV as string, `SCOPE=${process.env.SCOPE}\n`);
  });
} catch (error: any) {
  core.setFailed(error.message);
}