import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Cloudinary環境変数のモック
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud-name';
process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test-upload-preset';

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
