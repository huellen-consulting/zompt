import { deepmerge } from 'deepmerge-ts';
import { z } from 'zod';

import { Zompt } from '@/index';
import { type PromptOptions } from '@/objects/PromptOptions';

export const input = async <T>(
  zompt: Zompt,
  question: string,
  schema: z.Schema<T>,
  options?: PromptOptions,
): Promise<T> => {
  const defaultOptions: Required<PromptOptions> = {
    reprompt: true,
    messages: {
      errors: {
        invalid: zompt.configuration.messages.errors.invalid,
      },
      hint: 'type a value and press enter',
    },
  };

  options = deepmerge(defaultOptions, options || {});

  const primaryColor = zompt.configuration.colors!.primary!;
  const secondaryColor = zompt.configuration.colors!.secondary!.question!;
  const tertiaryColor = zompt.configuration.colors!.tertiary!;

  return new Promise((resolve, reject) => {
    zompt._log(
      `${question}${
        options!.messages!.hint
          ? ` ${tertiaryColor(`(${options!.messages!.hint})`)}`
          : ''
      }`,
      'question',
    );

    zompt.readline.question('', (value) => {
      zompt.history.push(value);
      zompt.readline.write('\n');

      zompt.readline.pause();

      try {
        const result = schema.parse(value);

        resolve(result);
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          zompt._log(options!.messages!.errors!.invalid!, 'error');

          zompt._log(
            `${secondaryColor('-')}${error.issues
              .map((issue) => ` ${primaryColor(issue.message)}\n`)
              .join(`${secondaryColor('-')}`)}`,
            'error',
            {
              prefix: false,
            },
          );

          if (options!.reprompt) {
            input(zompt, question, schema, options)
              .then((result) => resolve(result))
              .catch((error) => reject(error));

            return;
          }

          reject(error);
          return;
        }

        zompt._log(zompt.configuration.messages.errors.unknown, 'error');

        reject(new Error('An unknown error occurred.'));
      }
    });
  });
};
