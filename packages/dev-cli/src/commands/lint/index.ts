import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

import { Command, Flags } from '@oclif/core';
// @ts-ignore
import micromatch from 'micromatch';
import ora from 'ora';
import pc from 'picocolors';
import simpleGit from 'simple-git';

const execAsync = promisify(exec);

interface ExecError extends Error {
	stdout?: Buffer;
}

interface LintResult {
	success: boolean;
	output?: string;
	duration: number;
}

export default class Lint extends Command {
	static description = 'Run ESLint and Prettier checks';

	static flags = {
		fix: Flags.boolean({
			char: 'f',
			description: 'Automatically fix issues when possible',
			default: false,
		}),
		all: Flags.boolean({
			char: 'a',
			description: 'Check all files instead of just staged files',
			default: false,
		}),
	};

	private getRootDir(): string {
		return process.cwd().includes('packages/dev-cli')
			? path.resolve(process.cwd(), '../..')
			: process.cwd();
	}

	private async runESLint(fix: boolean, stagedOnly: boolean): Promise<LintResult> {
		const startTime = Date.now();
		const rootDir = this.getRootDir();

		try {
			if (stagedOnly) {
				const git = simpleGit(rootDir);
				const { staged } = await git.status();
				const tsFiles = micromatch(staged, ['**/*.ts', '**/*.tsx']);

				if (tsFiles.length === 0) {
					return {
						success: true,
						output: 'No TypeScript files staged.',
						duration: Date.now() - startTime,
					};
				}

				const cmd = `pnpm eslint --config packages/eslint-config/base.js ${tsFiles.map((f: string) => `"${f}"`).join(' ')}${fix ? ' --fix' : ''}`;

				try {
					const { stdout } = await execAsync(cmd, { cwd: rootDir });
					return {
						success: true,
						output: stdout || 'No issues found.',
						duration: Date.now() - startTime,
					};
				} catch (error) {
					const err = error as ExecError & { stdout?: string; stderr?: string };
					return {
						success: false,
						output: err.stderr || err.stdout || err.message,
						duration: Date.now() - startTime,
					};
				}
			}

			const configs = await this.findEslintConfigs();

			if (!configs.length) {
				return {
					success: true,
					output: 'No ESLint config files found.',
					duration: Date.now() - startTime,
				};
			}

			const results = await Promise.all(
				configs.map(async (configPath) => {
					const configDir = path.dirname(configPath);
					const files = ['**/*.ts', '**/*.tsx'];

					const cmd = `cd "${configDir}" && pnpm eslint --config packages/eslint-config/base.js ${files.map((f) => `"${f}"`).join(' ')}${fix ? ' --fix' : ''}`;

					try {
						const { stdout } = await execAsync(cmd, { cwd: rootDir });
						return {
							success: true,
							output: `${path.basename(configDir)}: ${stdout || 'No issues found.'}`,
							duration: Date.now() - startTime,
						};
					} catch (error) {
						const err = error as ExecError & { stdout?: string; stderr?: string };
						return {
							success: false,
							output: `${path.basename(configDir)}: ${err.stderr || err.stdout || err.message}`,
							duration: Date.now() - startTime,
						};
					}
				}),
			);

			const success = results.every((r) => r.success);
			const output = results
				.map((r) => r.output)
				.filter(Boolean)
				.join('\n\n');

			return {
				success,
				output: output || 'ESLint completed with no output.',
				duration: Date.now() - startTime,
			};
		} catch (error) {
			const err = error as ExecError & { stdout?: string; stderr?: string };
			return {
				success: false,
				output: err.stderr || err.stdout || err.message || 'ESLint failed with no error output',
				duration: Date.now() - startTime,
			};
		}
	}

	private async runPrettier(fix: boolean, stagedOnly: boolean): Promise<LintResult> {
		const startTime = Date.now();
		const rootDir = this.getRootDir();

		try {
			let cmd: string;

			if (stagedOnly) {
				const git = simpleGit(rootDir);
				const { staged } = await git.status();

				if (!staged.length) {
					return {
						success: true,
						output: 'No staged files to format.',
						duration: Date.now() - startTime,
					};
				}

				cmd = `pnpm prettier ${fix ? '--write' : '--check'} ${staged.map((f: string) => `"${f}"`).join(' ')}`;
			} else {
				cmd = `pnpm prettier ${fix ? '--write' : '--check'} "**/*.{ts,tsx,js,jsx,json,md,mdx,css,scss,html,yaml,yml}"`;
			}

			const { stdout } = await execAsync(cmd, { cwd: rootDir });
			return {
				success: true,
				output: stdout,
				duration: Date.now() - startTime,
			};
		} catch (error) {
			const err = error as ExecError & { stdout?: string; stderr?: string };
			return {
				success: false,
				output: err.stderr || err.stdout || err.message || 'Prettier failed with no error output',
				duration: Date.now() - startTime,
			};
		}
	}

	private async findEslintConfigs(): Promise<string[]> {
		const rootDir = this.getRootDir();
		const { stdout } = await execAsync(
			'find apps packages -type f -name "eslint.config.js" | grep -v "node_modules\\|dist"',
			{ cwd: rootDir },
		);
		return stdout
			.split('\n')
			.filter(Boolean)
			.map((f) => path.resolve(rootDir, f));
	}

	private printHeader(fix: boolean, stagedOnly: boolean) {
		this.log('\n' + pc.cyan(pc.bold('🚀 Running Code Quality Checks')));
		this.log(pc.dim(`Mode: ${fix ? 'Auto-fix enabled' : 'Check only'}`));
		this.log(pc.dim(`Scope: ${stagedOnly ? 'Staged files only' : 'All files'}\n`));
	}

	private printSummary(eslintResult: LintResult, prettierResult: LintResult) {
		const hasIssues = !eslintResult.success || !prettierResult.success;

		if (hasIssues) {
			this.log('\n' + pc.yellow(pc.bold('📝 Issues Found:')));
		}

		if (!eslintResult.success && eslintResult.output) {
			this.log('\n' + pc.yellow('ESLint Issues:'));
			this.log('─'.repeat(50));
			this.log(pc.dim(eslintResult.output.trim()));
		}

		if (!prettierResult.success && prettierResult.output) {
			this.log('\n' + pc.yellow('Prettier Issues:'));
			this.log('─'.repeat(50));
			this.log(pc.dim(prettierResult.output.trim()));
		}

		const totalTime = eslintResult.duration + prettierResult.duration;

		this.log('\n' + pc.bold('Summary:'));
		this.log('─'.repeat(50));
		this.log(`ESLint:   ${eslintResult.success ? pc.green('✓ Passed') : pc.red('✗ Failed')}`);
		this.log(`Prettier: ${prettierResult.success ? pc.green('✓ Passed') : pc.red('✗ Failed')}`);
		this.log(pc.dim(`Total time: ${this.formatTime(totalTime)}\n`));
	}

	private formatTime = (ms: number): string => {
		return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
	};

	async run() {
		const { flags } = await this.parse(Lint);
		const stagedOnly = !flags.all;

		try {
			const git = simpleGit(this.getRootDir());
			const { staged } = await git.status();

			if (stagedOnly && staged.length === 0) {
				this.log('\n' + pc.yellow('No staged files found. Nothing to check.\n'));
				return;
			}

			this.printHeader(flags.fix, stagedOnly);

			const tsFiles = micromatch(staged, ['**/*.ts', '**/*.tsx']).length;
			const otherFiles = staged.length - tsFiles;
			this.log(
				pc.dim(
					`Found ${pc.bold(staged.length)} staged files to check: ` +
						`${pc.cyan(tsFiles)} TypeScript, ` +
						`${pc.cyan(otherFiles)} other files\n`,
				),
			);

			// Run ESLint
			const eslintSpinner = ora({
				prefixText: '  ',
				text: 'Running ESLint...',
				spinner: 'dots',
			}).start();

			const eslintResult = await this.runESLint(flags.fix, stagedOnly);

			if (eslintResult.success) {
				eslintSpinner.stopAndPersist({
					symbol: pc.green('✓'),
					text: pc.green(`ESLint completed in ${this.formatTime(eslintResult.duration)}`),
				});
			} else {
				eslintSpinner.stopAndPersist({
					symbol: pc.red('✗'),
					text: pc.red(`ESLint failed in ${this.formatTime(eslintResult.duration)}`),
				});
			}

			// Run Prettier
			const prettierSpinner = ora({
				prefixText: '  ',
				text: 'Running Prettier...',
				spinner: 'dots',
			}).start();

			const prettierResult = await this.runPrettier(flags.fix, stagedOnly);

			if (prettierResult.success) {
				prettierSpinner.stopAndPersist({
					symbol: pc.green('✓'),
					text: pc.green(`Prettier completed in ${this.formatTime(prettierResult.duration)}`),
				});
			} else {
				prettierSpinner.stopAndPersist({
					symbol: pc.red('✗'),
					text: pc.red(`Prettier failed in ${this.formatTime(prettierResult.duration)}`),
				});
			}

			this.log('');

			// Summary
			this.printSummary(eslintResult, prettierResult);

			// Fail if needed
			if (!eslintResult.success || !prettierResult.success) {
				throw new Error('Checks failed');
			}
		} catch (error) {
			this.error(
				pc.red(pc.bold('\n❌ Code quality checks failed. Please fix the issues and try again.\n')),
			);
			process.exit(1);
		}
	}
}
