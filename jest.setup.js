// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '24h';

// Suppress console output during tests (optional)
// console.log = jest.fn();
// console.error = jest.fn();
// console.warn = jest.fn(); 