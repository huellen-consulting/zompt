import { type Chalk } from 'chalk';

export type Configuration = {
  streams?: {
    input?: NodeJS.ReadStream;
    output?: NodeJS.WriteStream;
  };
  colors?: {
    primary?: Chalk;
    secondary?: {
      question?: Chalk;
      info?: Chalk;
      item?: Chalk;
      'active-item'?: Chalk;
      'selected-item'?: Chalk;
      error?: Chalk;
      warning?: Chalk;
      success?: Chalk;
    };
    tertiary?: Chalk;
  };
  prefixes: {
    question?: string;
    info?: string;
    item?: string;
    'active-item'?: string;
    'selected-item'?: string;
    error?: string;
    warning?: string;
    success?: string;
  };
  messages: {
    errors: {
      unknown: string;
      invalid: string;
    };
  };
};
