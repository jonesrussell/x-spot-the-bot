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
  if (callback) {
    if (typeof keys === 'string') {
      callback({ [keys]: null });
    } else if (Array.isArray(keys)) {
      callback(Object.fromEntries(keys.map(key => [key, null])));
    } else if (typeof keys === 'object') {
      callback(Object.fromEntries(
        Object.entries(keys).map(([key, defaultValue]) => [key, defaultValue])
      ));
    } else {
      callback({});
    }
  }
});

mockChromeStorage.local.set.mockImplementation((items, callback) => {
  if (callback) {
    callback();
  }
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