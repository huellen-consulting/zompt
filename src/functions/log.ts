import { deepmerge } from 'deepmerge-ts';

import { Zompt } from '@/index';
import { type LogType } from '@/objects/LogType';
import { type LogOptions } from '@/objects/LogOptions';

export const log = (
  zompt: Zompt,
  message: string,
  type: LogType,
  options?: LogOptions,
) => {
  const defaultOptions: Required<LogOptions> = {
    prefix: true,
    newline: true,
  };

  options = deepmerge(defaultOptions, options || {});

  const primaryColor = zompt.configuration.colors!.primary!;
  const secondaryColor = zompt.configuration.colors!.secondary![type]!;
  const prefix = zompt.configuration.prefixes[type]!;

  const formattedMessage = `${
    options.prefix ? `${secondaryColor(prefix)} ` : ''
  }${primaryColor(message)}${options.newline ? '\n' : ''}`;

  zompt.readline.write(formattedMessage);

  return formattedMessage;
};
