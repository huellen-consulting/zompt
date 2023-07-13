export type PromptOptions = {
  reprompt?: boolean;
  messages?: {
    errors?: {
      invalid?: string;
    };
    hint?: string;
  };
};
