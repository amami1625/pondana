'use client';

import { User as UserIcon, Upload, Trash2 } from 'lucide-react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { User } from '@/schemas/user';
import { useAvatarUpload } from '@/app/(protected)/settings/_hooks/useAvatarUpload';
import Button from '@/components/buttons/Button';

interface AvatarUploadProps {
  user: User;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const { isUploading, handleUploadSuccess, handleUploadError, handleDelete, setIsUploading } =
    useAvatarUpload({ user });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary環境変数が設定されていません');
    return null;
  }

  return (
    <div className="mb-8 flex flex-col items-center gap-4">
      {/* アバター画像 */}
      <div className="relative h-24 w-24 flex-shrink-0">
        {user.avatar_public_id ? (
          <CldImage
            src={user.avatar_public_id}
            alt={user.name}
            width={96}
            height={96}
            crop="thumb"
            gravity="custom"
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
            <UserIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex gap-2">
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            sources: ['local', 'camera'],
            multiple: false,
            maxFiles: 1,
            folder: 'avatars',
            clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
            maxFileSize: 5000000, // 5MB
            cropping: true,
            croppingAspectRatio: 1,
            croppingShowDimensions: true,
            croppingCoordinatesMode: 'custom',
            showSkipCropButton: false,
          }}
          onSuccess={(result) => {
            if (typeof result.info === 'object' && 'secure_url' in result.info) {
              handleUploadSuccess(result.info);
            }
          }}
          onError={handleUploadError}
          onOpen={() => setIsUploading(true)}
          onClose={() => setIsUploading(false)}
        >
          {({ open }) => (
            <Button
              variant="secondary"
              onClick={() => open()}
              icon={<Upload size={18} />}
              disabled={isUploading}
              loadingLabel="アップロード中..."
            >
              {user.avatar_url ? '画像を変更' : '画像をアップロード'}
            </Button>
          )}
        </CldUploadWidget>

        {user.avatar_url && (
          <Button
            variant="danger"
            onClick={handleDelete}
            icon={<Trash2 size={18} />}
            disabled={isUploading}
          >
            削除
          </Button>
        )}
      </div>
    </div>
  );
}
