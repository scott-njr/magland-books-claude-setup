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

// Stub the Sheets service so server actions don't try real network calls in unit tests.
jest.mock('@/lib/services/sheets', () => ({
  appendToSheet: jest.fn().mockResolvedValue({ ok: true }),
}));
