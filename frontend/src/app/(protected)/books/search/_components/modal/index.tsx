import BaseModal from '@/components/modals/BaseModal';

interface UsageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UsageGuideModal({ isOpen, onClose }: UsageGuideModalProps) {
  return (
    <BaseModal title="使い方" isOpen={isOpen} onClose={onClose}>
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
          <li>検索ボックスに書籍名、著者名を入力してください</li>
          <li>候補がドロップダウンで表示されます（2文字以上入力が必要です）</li>
          <li>候補から書籍を選択すると、詳細情報が表示されます</li>
          <li>「この本を登録」ボタンをクリックして書籍を登録してください</li>
        </ol>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-blue-700">
            💡 ヒント: 矢印キー（↑↓）で候補を選択、Enterキーで決定、Escキーで閉じることができます
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
