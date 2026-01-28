import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGoogleLoginButton } from '@/app/(auth)/_hooks/useGoogleLoginButton';
import GoogleLoginButton from './GoogleLoginButton';

vi.mock('@/app/(auth)/_hooks/useGoogleLoginButton');

describe('GoogleLoginButton', () => {
  const mockHandleGoogleLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isLoading=falseの場合、「Googleでログイン」と表示されボタンが有効', () => {
    vi.mocked(useGoogleLoginButton).mockReturnValue({
      isLoading: false,
      handleGoogleLogin: mockHandleGoogleLogin,
    });

    render(<GoogleLoginButton />);

    const button = screen.getByRole('button', { name: /Googleでログイン/ });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('isLoading=trueの場合、「ログイン中...」と表示されボタンが無効', () => {
    vi.mocked(useGoogleLoginButton).mockReturnValue({
      isLoading: true,
      handleGoogleLogin: mockHandleGoogleLogin,
    });

    render(<GoogleLoginButton />);

    const button = screen.getByRole('button', { name: /ログイン中.../ });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('ボタンクリック時にhandleGoogleLoginが呼ばれる', async () => {
    vi.mocked(useGoogleLoginButton).mockReturnValue({
      isLoading: false,
      handleGoogleLogin: mockHandleGoogleLogin,
    });

    render(<GoogleLoginButton />);

    const button = screen.getByRole('button', { name: /Googleでログイン/ });
    await userEvent.click(button);

    expect(mockHandleGoogleLogin).toHaveBeenCalledTimes(1);
  });
});
