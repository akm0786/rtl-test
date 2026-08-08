import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Test server create karo
export const server = setupServer(...handlers);