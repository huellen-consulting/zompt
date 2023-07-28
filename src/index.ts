import chalk from 'chalk';
import { deepmerge } from 'deepmerge-ts';
import readline from 'readline';
import { z } from 'zod';

import { log } from './functions/log';
import { input } from './functions/input';
import { multiselect } from './functions/multiselect';
import { select } from './functions/select';

import { type Choice } from './objects/Choice';
import { type Configuration } from './objects/Configuration';
import { type LogOptions } from './objects/LogOptions';
import { type LogType } from './objects/LogType';
import { type PromptOptions } from './objects/PromptOptions';

export { z };

export class Zompt {
  configuration: Configuration;
  history: string[] = [];
  readline: readline.Interface;
  _storeHistory: boolean = true;

  constructor(configuration?: Configuration) {
    const defaultConfiguration: Required<Configuration> = {
      streams: {
        input: process.stdin,
        output: process.stdout,
      },
      colors: {
        primary: chalk.white,
        secondary: {
          question: chalk.cyan,
          info: chalk.cyan,
          item: chalk.cyan,
          'active-item': chalk.cyan,
          'selected-item': chalk.green,
          error: chalk.red,
          warning: chalk.yellow,
          success: chalk.green,
        },
        tertiary: chalk.gray,
      },
      prefixes: {
        question: '?',
        info: 'ℹ',
        item: '○',
        'active-item': '●',
        'selected-item': '◉',
        error: '✖',
        warning: '⚠',
        success: '✔',
      },
      messages: {
        errors: {
          invalid: 'There was an issue with your answer.',
          unknown: 'An unknown error occurred.',
        },
      },
    };

    this.configuration = deepmerge(defaultConfiguration, configuration || {});

    this.readline = readline.createInterface({
      input: this.configuration.streams!.input!,
      output: this.configuration.streams!.output!,
    });

    this.readline.on('line', (line) => {
      if (!this._storeHistory) {
        return;
      }

      this.history.push(line);
    });

    process.on('beforeExit', () => {
      this.readline.close();
    });

    this.clear();
  }

  clear() {
    this.readline.write('\x1Bc');

    this.readline.pause();
  }

  async input<T>(
    question: string,
    schema: z.Schema<T>,
    options?: PromptOptions,
  ) {
    return input(this, question, schema, options);
  }

  _log(message: string, level: LogType, options?: LogOptions) {
    log(this, message, level, options);
  }

  log(message: string, level: LogType, options?: LogOptions) {
    this._log(message, level, options);

    this.readline.pause();
  }

  async multiselect<T>(
    question: string,
    choices: Choice<T>[],
    options?: PromptOptions,
  ) {
    return multiselect(this, question, choices, options);
  }

  async select<T>(
    question: string,
    choices: Choice<T>[],
    options?: PromptOptions,
  ) {
    return select(this, question, choices, options);
  }

  _rerender() {
    const wasStoringHistory = this._storeHistory;
    this._storeHistory = false;

    this.history.forEach((line) => this.readline.write(`${line}\n`));

    this._storeHistory = wasStoringHistory;
  }

  rerender() {
    this._rerender();

    this.readline.pause();
  }
}
