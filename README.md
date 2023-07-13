![Zompt](https://i.imgur.com/EEs7eok.png)

# Zompt

The TypeScript-first prompting library for Node.js CLIs.

## Why Zompt?

To date, traditional JavaScript prompting libraries such as [prompt](https://www.npmjs.com/package/prompt) and [inquirer](https://www.npmjs.com/package/inquirer) have yet to support TypeScript typing for a user's input, or as Zompt calls it, answer. Though this isn't possible with traditional TypeScript, the [zod](https://www.npmjs.com/package/zod) library has become increasingly popular in recent years for runtime validation of TypeScript types. As a result, we're leveraging this library to bring this functionality to you.

## Features

* Text input
  - Runtime [zod](<(https://www.npmjs.com/package/zod)>) validation
  - Semantic error responses by preferring [zod](https://www.npmjs.com/package/zod) parsing errors
* Select input
  - Static typing for choices
  - Ability to set a default
* Multiselect input
  - Static typing for choices
  - Ability to set defaults

## How to use it

First, install [zompt](https://github.com/huellen-consulting/zompt) from [npm](https://www.npmjs.com/package/prompt).

```bash
npm i zompt
```

Then, import [zompt](https://github.com/huellen-consulting/zompt).

```js
import { Zompt } from 'zompt';
```

Next, instantiate a new instance. There are a variety of configuration options available to truly make this library your own. By default, we leverage [chalk](https://www.npmjs.com/package/prompt) for formatting.

```js
// Using the default configuration
const zompt = new Zompt();

// If you wish to make the library your own!
const zompt = new Zompt({
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
});
```

Now, start asking your user's questions and have peace of mind with types!

```javascript
  const name = await zompt.input(
    'What is your name?',
    z
      .string()
      .min(3, {
        message: 'Your name must be at least 3 characters long.',
      })
      .regex(/^[a-zA-Z]+$/, {
        message: 'Your name must only contain letters.',
      }),
  );

  const color = await zompt.input(
    'What is your favorite color?',
    z.enum(['red', 'orange', 'yellow', 'green', 'blue', 'purple'], {
      errorMap: () => ({ message: 'Please choose a color from the rainbow!' }),
    }),
  );

  const cloudPlatform = await zompt.select<'aws' | 'gcp' | 'azure'>(
    'What is your favorite cloud platform?',
    [
      {
        label: 'Amazon Web Services',
        value: 'aws',
      },
      {
        label: 'Google Cloud Platform',
        value: 'gcp',
      },
      {
        label: 'Microsoft Azure',
        value: 'azure',
      },
    ],
  );

  const languages = await zompt.multiselect<'js' | 'py' | 'java' | 'c'>(
    'What programming languages do you know?',
    [
      {
        label: 'JavaScript',
        value: 'js',
      },
      {
        label: 'Python',
        value: 'py',
        default: true,
      },
      {
        label: 'Java',
        value: 'java',
      },
      {
        label: 'C',
        value: 'c',
      },
    ],
  );

  // Finally, make your success messages look identical to your prompts!
  zompt.log(
    `Hello, ${name}!
    I see you like the color ${color}.
    You also like the cloud platform ${cloudPlatform}.
    Finally, ${
      languages.get('js') ? 'you know' : "you don't know"
    } JavaScript!`,
    'success', // 'info' | 'error' | 'warning' | 'success'
  );
```

## Is this here to stay?

Absolutely. At John Deere ([my](<[my](https://github.com/ryanhaticus)>) day job), I work on numerous developer experience CLIs and always felt TypeScript was treated as an afterthought. That being said, [zompt](https://github.com/huellen-consulting/zompt) was born as a side project with the intention of bringing it to the Fortune 100 space. Though the company itself does not maintain this piece of software, I will be regularly updating and improving it.

## Contributing

At the moment, I'd love for someone to start writing unit tests! I plan to do this in the future myself, but it isn't a high priority for me at the moment! If you're at all interested, please reach out to [me](https://github.com/ryanhaticus)!
