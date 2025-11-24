import { describe, it, expect } from 'vitest';
import { translateAuthError } from './translateAuthError';

describe('translateAuthError', () => {
  describe('ログイン関連のエラー', () => {
    it('Invalid login credentials を日本語に変換する', () => {
      const result = translateAuthError('Invalid login credentials');
      expect(result).toBe('メールアドレスまたはパスワードが正しくありません');
    });

    it('Invalid email or password を日本語に変換する', () => {
      const result = translateAuthError('Invalid email or password');
      expect(result).toBe('メールアドレスまたはパスワードが正しくありません');
    });
  });

  describe('登録関連のエラー', () => {
    it('User already registered を汎用メッセージに変換する（セキュリティ対策）', () => {
      const result = translateAuthError('User already registered');
      expect(result).toBe('エラーが発生しました。もう一度お試しください');
    });
  });

  describe('パスワードリセット関連のエラー', () => {
    it('Password reset link is invalid or has expired を日本語に変換する', () => {
      const result = translateAuthError('Password reset link is invalid or has expired');
      expect(result).toBe('パスワードリセットリンクが無効か期限切れです');
    });

    it('New password should be different from the old password を日本語に変換する', () => {
      const result = translateAuthError('New password should be different from the old password');
      expect(result).toBe('新しいパスワードは現在のパスワードと異なるものにしてください');
    });
  });

  describe('セッション関連のエラー', () => {
    it('Session not found を日本語に変換する', () => {
      const result = translateAuthError('Session not found');
      expect(result).toBe('セッションが見つかりません。再度ログインしてください');
    });

    it('Session expired を日本語に変換する', () => {
      const result = translateAuthError('Session expired');
      expect(result).toBe('セッションの有効期限が切れました。再度ログインしてください');
    });

    it('Auth session missing を日本語に変換する', () => {
      const result = translateAuthError('Auth session missing');
      expect(result).toBe('認証セッションがありません。再度ログインしてください');
    });
  });

  describe('ネットワーク・サーバーエラー', () => {
    it('Failed to fetch を日本語に変換する', () => {
      const result = translateAuthError('Failed to fetch');
      expect(result).toBe('ネットワークエラーが発生しました。接続を確認してください');
    });

    it('Network request failed を日本語に変換する', () => {
      const result = translateAuthError('Network request failed');
      expect(result).toBe('ネットワークエラーが発生しました。接続を確認してください');
    });
  });

  describe('その他のエラー', () => {
    it('Email rate limit exceeded を日本語に変換する', () => {
      const result = translateAuthError('Email rate limit exceeded');
      expect(result).toBe('メール送信の上限に達しました。しばらく待ってから再度お試しください');
    });

    it('Too many requests を日本語に変換する', () => {
      const result = translateAuthError('Too many requests');
      expect(result).toBe('リクエストが多すぎます。しばらく待ってから再度お試しください');
    });
  });

  describe('部分一致', () => {
    it('大文字小文字を無視して Invalid Login を日本語に変換する', () => {
      const result = translateAuthError('invalid login credentials');
      expect(result).toBe('メールアドレスまたはパスワードが正しくありません');
    });

    it('エラーメッセージに含まれる文字列で部分一致する', () => {
      const result = translateAuthError('Error: Session expired. Please login again.');
      expect(result).toBe('セッションの有効期限が切れました。再度ログインしてください');
    });
  });

  describe('マッチしないエラー', () => {
    it('未知のエラーメッセージの場合デフォルトメッセージを返す', () => {
      const result = translateAuthError('Unknown error occurred');
      expect(result).toBe('エラーが発生しました。もう一度お試しください');
    });

    it('空文字列の場合デフォルトメッセージを返す', () => {
      const result = translateAuthError('');
      expect(result).toBe('エラーが発生しました。もう一度お試しください');
    });
  });
});
