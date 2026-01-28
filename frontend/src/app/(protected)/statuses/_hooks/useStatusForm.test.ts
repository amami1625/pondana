import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { Status } from '@/app/(protected)/statuses/_types';
import { useStatusMutations } from './useStatusMutations';
import { useStatusForm } from './useStatusForm';

vi.mock('./useStatusMutations');

describe('useStatusForm', () => {
  const mockCancel = vi.fn();
  const mockCreateStatus = vi.fn();
  const mockUpdateStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStatusMutations).mockReturnValue({
      createStatus: mockCreateStatus,
      updateStatus: mockUpdateStatus,
      deleteStatus: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      createError: null,
      updateError: null,
      deleteError: null,
    });
  });

  describe('onSubmit', () => {
    describe('新規作成モード', () => {
      it('createStatus が呼ばれ、成功時に cancel が実行される', async () => {
        mockCreateStatus.mockImplementation((_, options) => options?.onSuccess?.());
  
        const { result } = renderHook(() => useStatusForm({ cancel: mockCancel }), {
          wrapper: createProvider(),
        });
  
        await act(async () => {
          await result.current.onSubmit({ name: '新しいステータス' });
        });
  
        expect(mockCreateStatus).toHaveBeenCalledWith(
          { name: '新しいステータス' },
          expect.objectContaining({ onSuccess: expect.any(Function) }),
        );
        expect(mockCancel).toHaveBeenCalled();
      });
    });
  
    describe('更新モード', () => {
      const existingStatus: Status = {
        id: 1,
        name: '既存ステータス',
        user_id: 'user-123',
        created_at: '2025/1/1 0:00:00',
        updated_at: '2025/1/1 0:00:00',
      };
  
      it('updateStatus が id と共に呼ばれ、成功時に cancel が実行される', async () => {
        mockUpdateStatus.mockImplementation((_, options) => options?.onSuccess?.());
  
        const { result } = renderHook(() => useStatusForm({ status: existingStatus, cancel: mockCancel }), {
          wrapper: createProvider(),
        });
  
        await act(async () => {
          await result.current.onSubmit({ name: '更新後ステータス' });
        });
  
        expect(mockUpdateStatus).toHaveBeenCalledWith(
          { id: 1, name: '更新後ステータス' },
          expect.objectContaining({ onSuccess: expect.any(Function) }),
        );
        expect(mockCancel).toHaveBeenCalled();
      });
    });
  })

  describe('isSubmitting', () => {
    it('isCreatingがtrueの場合、isSubmittingがtrueになる', () => {
      vi.mocked(useStatusMutations).mockReturnValue({
        createStatus: mockCreateStatus,
        updateStatus: mockUpdateStatus,
        deleteStatus: vi.fn(),
        isCreating: true,
        isUpdating: false,
        isDeleting: false,
        createError: null,
        updateError: null,
        deleteError: null,
      });

      const { result } = renderHook(() => useStatusForm({ cancel: mockCancel }), {
        wrapper: createProvider(),
      });

      expect(result.current.isSubmitting).toBe(true);
    });

    it('isUpdatingがtrueの場合、isSubmittingがtrueになる', () => {
      vi.mocked(useStatusMutations).mockReturnValue({
        createStatus: mockCreateStatus,
        updateStatus: mockUpdateStatus,
        deleteStatus: vi.fn(),
        isCreating: false,
        isUpdating: true,
        isDeleting: false,
        createError: null,
        updateError: null,
        deleteError: null,
      });

      const { result } = renderHook(() => useStatusForm({ cancel: mockCancel }), {
        wrapper: createProvider(),
      });

      expect(result.current.isSubmitting).toBe(true);
    });
  });
});
