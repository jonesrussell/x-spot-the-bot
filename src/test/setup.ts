import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Chrome API
const mockChrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      clear: vi.fn()
    }
  }
};

// @ts-expect-error - Chrome API mock
global.chrome = mockChrome;

// Mock CSS modules
vi.mock('*.css', () => ({ default: {} }));

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: {
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false
  }
})); 