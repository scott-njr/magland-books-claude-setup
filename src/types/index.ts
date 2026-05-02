// Shared types used across server actions, components, and lib helpers.

export type FormState = {
  success: boolean;
  message: string;
};

export const INITIAL_FORM_STATE: FormState = {
  success: false,
  message: '',
};

export type CartLineItem = {
  bookId: string;
  slug: string;
  quantity: number;
};
