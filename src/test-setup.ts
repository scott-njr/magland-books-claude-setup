// Global mocks for the JSDOM test environment.

// JSDOM does not implement window.matchMedia; provide a no-op polyfill
// so components that subscribe to media queries can render in tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}

// Stub the Resend service so server actions don't try real network calls in unit tests.
jest.mock('@/lib/services/resend', () => ({
  sendContactEmail: jest.fn().mockResolvedValue({ ok: true }),
  addToNewsletterAudience: jest.fn().mockResolvedValue({ ok: true }),
}));
