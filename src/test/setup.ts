import '@testing-library/jest-dom/vitest';

globalThis.ResizeObserver = class ResizeObserver {
  disconnect() {}

  observe() {}

  unobserve() {}
};
