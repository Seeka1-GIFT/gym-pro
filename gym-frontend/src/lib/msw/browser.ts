import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * A service worker for MSW to intercept API requests in development.
 */
export const worker = setupWorker(...handlers);