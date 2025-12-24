import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW サーバー（Node.js環境用）
 * Vitestのテスト環境で使用します
 */
export const server = setupServer(...handlers);
