/**
 * Supabase Auth のエラーメッセージを日本語に変換する
 * @param error エラーメッセージまたはエラーコード
 * @returns 日本語のエラーメッセージ
 */
export function translateAuthError(error: string): string {
  const errorMessages: Record<string, string> = {
    // ログイン関連
    'Invalid login credentials': 'メールアドレスまたはパスワードが正しくありません',
    'Invalid email or password': 'メールアドレスまたはパスワードが正しくありません',

    // 登録関連
    'User already registered': 'エラーが発生しました。もう一度お試しください',

    // パスワードリセット関連
    'Password reset link is invalid or has expired': 'パスワードリセットリンクが無効か期限切れです',
    'New password should be different from the old password':
      '新しいパスワードは現在のパスワードと異なるものにしてください',

    // セッション関連
    'Session not found': 'セッションが見つかりません。再度ログインしてください',
    'Session expired': 'セッションの有効期限が切れました。再度ログインしてください',
    'Auth session missing': '認証セッションがありません。再度ログインしてください',

    // ネットワーク・サーバーエラー
    'Failed to fetch': 'ネットワークエラーが発生しました。接続を確認してください',
    'Network request failed': 'ネットワークエラーが発生しました。接続を確認してください',

    // その他
    'Email rate limit exceeded':
      'メール送信の上限に達しました。しばらく待ってから再度お試しください',
    'Too many requests': 'リクエストが多すぎます。しばらく待ってから再度お試しください',
  };

  // 完全一致
  if (errorMessages[error]) {
    return errorMessages[error];
  }

  // 部分一致（大文字小文字を無視）
  const lowerError = error.toLowerCase();
  for (const [key, value] of Object.entries(errorMessages)) {
    if (lowerError.includes(key.toLowerCase())) {
      return value;
    }
  }

  // マッチしない場合はデフォルトメッセージ
  return 'エラーが発生しました。もう一度お試しください';
}
