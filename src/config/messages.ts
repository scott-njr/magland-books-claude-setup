// User-facing copy strings — keep them here so they're swappable without touching components.

export const SUCCESS = {
  newsletterSubscribed:
    "Thank you. We'll write when we have something worth your inbox.",
  contactSubmitted:
    "Thanks for writing. We read every note — we'll be in touch soon.",
} as const;

export const ERRORS = {
  generic: 'Something went wrong. Please try again.',
  rateLimited: 'Too many requests. Please wait a moment and try again.',
  network: 'We couldn\'t reach our mailbox. Please try again in a minute.',
} as const;

// Honeypot decoy responses — look like success to bots but silently reject.
export const HONEYPOT_DECOY = {
  newsletter: SUCCESS.newsletterSubscribed,
  contact: SUCCESS.contactSubmitted,
} as const;

export const VALIDATION = {
  required: (field: string) => `${field} is required.`,
  invalidChars: (field: string) => `${field} contains invalid characters.`,
  invalidEmail: 'Please enter a valid email address.',
  emailRequired: 'Email is required.',
  messageRequired: 'Please write us a message.',
  invalidContent: 'Message contains content we can\'t accept.',
  addressRequired: (field: string) => `${field} is required to ship a book to you.`,
  invalidAddress: (field: string) => `${field} doesn't look right — please check it.`,
  invalidZip: 'Please enter a valid 5-digit US ZIP code.',
} as const;

// Cart microcopy
export const CART_COPY = {
  shipsFromIdaho: 'Ships in 1–2 business days from our home in Idaho',
  empty: 'Your bag is empty — for now.',
  subtotal: 'Subtotal',
  shipping: 'Shipping is calculated at checkout.',
  tax: 'Tax calculated at checkout',
} as const;

// Checkout microcopy
export const CHECKOUT_COPY = {
  flatShipping: 'Flat-rate shipping (US only)',
  shippingFee: '$5.00',
  cardFieldLabel: 'Card details',
  cardFieldHint: 'Card information is sent directly to Square — we never touch it.',
  placeOrder: 'Place order →',
  placingOrder: 'Placing your order…',
  totalLabel: 'Total',
  subtotalLabel: 'Subtotal',
  shippingLabel: 'Shipping',
  emptyBagTitle: 'Your bag is empty.',
  emptyBagBody: 'Find a book on the bookshelf and we\'ll put it on the way to you.',
  cardError:
    'We couldn\'t read your card. Please double-check the details and try again.',
  orderError:
    'Something went wrong placing your order. Please try again, or write to us at hello@maglandbooks.com.',
  paymentError:
    'Your card was declined or the payment couldn\'t be completed. Please try again or use another card.',
} as const;
