import '@testing-library/jest-dom';

// Mock Chrome API
const mockChromeStorage = {
  local: {
    get: jest.fn(),
    set: jest.fn()
  }
};

// Type-safe mock implementation
mockChromeStorage.local.get.mockImplementation((keys, callback) => {
  if (typeof keys === 'string') {
    callback?.({ [keys]: null });
    return Promise.resolve({ [keys]: null });
  }
  if (Array.isArray(keys)) {
    const result = Object.fromEntries(keys.map(key => [key, null]));
    callback?.(result);
    return Promise.resolve(result);
  }
  if (typeof keys === 'object') {
    const result = Object.fromEntries(
      Object.entries(keys).map(([key, defaultValue]) => [key, defaultValue])
    );
    callback?.(result);
    return Promise.resolve(result);
  }
  callback?.({});
  return Promise.resolve({});
});

mockChromeStorage.local.set.mockImplementation((items, callback) => {
  callback?.();
  return Promise.resolve();
});

// Assign mock to global object
Object.assign(global, {
  chrome: {
    storage: mockChromeStorage
  }
});

// Silence console.debug in tests
console.debug = jest.fn();

// Add custom matchers
expect.extend({
  toHaveBeenCalledWithObject(received: jest.Mock, expected: object) {
    const calls = received.mock.calls;
    const match = calls.some(call => {
      const [actual] = call;
      return Object.entries(expected).every(
        ([key, value]) => actual[key] === value
      );
    });

    return {
      pass: match,
      message: () =>
        `expected ${received.getMockName()} to have been called with an object containing ${JSON.stringify(
          expected,
          null,
          2
        )}`
    };
  }
}); 