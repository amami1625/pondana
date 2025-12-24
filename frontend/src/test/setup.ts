import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// MSWサーバーのセットアップ
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
