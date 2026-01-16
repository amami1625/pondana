import { useState } from 'react';
import { User } from '@/schemas/user';
import { useProfileMutations } from '@/app/(protected)/settings/_hooks/useProfileMutations';
import toast from 'react-hot-toast';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

interface UseAvatarUploadProps {
  user: User;
}

export function useAvatarUpload({ user }: UseAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { updateUser, isUpdating } = useProfileMutations();

  const handleUploadSuccess = (result: CloudinaryUploadResponse) => {
    setIsUploading(false);
    const avatarUrl = result.secure_url;
    const avatarPublicId = result.public_id;

    // プロフィールを更新（nameは必須なので含める）
    updateUser({ name: user.name, avatar_url: avatarUrl, avatar_public_id: avatarPublicId });
  };

  const handleUploadError = () => {
    setIsUploading(false);
    toast.error('画像のアップロードに失敗しました');
  };

  const handleDelete = () => {
    // avatar_urlとavatar_public_idをnullにして削除
    updateUser({ name: user.name, avatar_url: null, avatar_public_id: null });
  };

  return {
    isUploading: isUploading || isUpdating,
    handleUploadSuccess,
    handleUploadError,
    handleDelete,
    setIsUploading,
  };
}
