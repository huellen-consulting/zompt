import { deepmerge } from 'deepmerge-ts';

import { Zompt } from '@/index';
import { type PromptOptions } from '@/objects/PromptOptions';
import { type Choice } from '@/objects/Choice';

const renderSelect = <T>(
  zompt: Zompt,
  position: number,
  choices: Choice<T>[],
) => {
  const primaryColor = zompt.configuration.colors!.primary!;
  const secondaryColor = zompt.configuration.colors!.secondary!.question!;

  choices.forEach((choice, index) => {
    if (index === position) {
      zompt._log(`${secondaryColor(choice.label)}`, 'active-item');

      return;
    }

    zompt._log(`${primaryColor(choice.label)}`, 'item');
  });
};

export const select = async <T>(
  zompt: Zompt,
  question: string,
  choices: Choice<T>[],
  options?: PromptOptions,
): Promise<T> => {
  const defaultOptions: Required<PromptOptions> = {
    reprompt: false,
    messages: {
      errors: {
        invalid: zompt.configuration.messages.errors.invalid,
      },
      hint: 'up and down to navigate, enter to select',
    },
  };

  options = deepmerge(defaultOptions, options || {});

  const tertiaryColor = zompt.configuration.colors!.tertiary!;
  const defaultIndex = choices.findIndex((choice) => choice.default);
  let position = defaultIndex > -1 ? defaultIndex : 0;

  return new Promise((resolve) => {
    zompt._log(
      `${question}${
        options!.messages!.hint
          ? ` ${tertiaryColor(`(${options!.messages!.hint})`)}`
          : ''
      }`,
      'question',
    );

    zompt._storeHistory = false;

    renderSelect(zompt, position, choices);

    zompt.configuration.streams!.input!.on('keypress', (_, key) => {
      if (key.name === 'up' && position > 0) {
        position--;

        zompt._rerender();
        renderSelect(zompt, position, choices);

        return;
      }

      if (key.name === 'down' && position < choices.length - 1) {
        position++;

        zompt._rerender();
        renderSelect(zompt, position, choices);

        return;
      }

      if (key.name !== 'return') {
        return;
      }

      zompt._rerender();

      zompt._storeHistory = true;
      renderSelect(zompt, position, choices);

      zompt.readline.pause();
      process.stdin.removeAllListeners('keypress');

      zompt.readline.write('\n');

      resolve(choices[position]!.value);
    });
  });
};
