import '@testing-library/jest-dom';

import { server } from '../mocks/server';

// Sab tests se pehle server start
beforeAll(() => server.listen({ 
  onUnhandledRequest: 'warn' // Unhandled requests ko warning do, error nahi
}));

// Har test ke baad server reset karo
afterEach(() => server.resetHandlers());

// Sab tests ke baad server close karo
afterAll(() => server.close());