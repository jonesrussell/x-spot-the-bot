// Mock Chrome Extension API
const mockChrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  }
};

// Add chrome to global scope
(global as any).chrome = mockChrome;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  // Clean up any DOM modifications
  document.body.innerHTML = '';
  
  // Reset storage mocks
  mockChrome.storage.local.get.mockReset();
  mockChrome.storage.local.set.mockReset();
  mockChrome.storage.local.remove.mockReset();
  mockChrome.storage.local.clear.mockReset();
}); 