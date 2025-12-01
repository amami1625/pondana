import { describe, it, expect } from 'vitest';
import { getIcon, getMessage } from './EmptyState.helpers';
import { BookOpen, Library, StickyNote } from 'lucide-react';

describe('getIcon', () => {
  it('本の場合、BookOpenアイコンを返す', () => {
    const icon = getIcon('本');

    expect(icon).toBe(BookOpen);
  });

  it('リストの場合、Libraryアイコンを返す', () => {
    const icon = getIcon('リスト');

    expect(icon).toBe(Library);
  });

  it('カードの場合、StickyNoteアイコンを返す', () => {
    const icon = getIcon('カード');

    expect(icon).toBe(StickyNote);
  });
});

describe('getMessage', () => {
  describe('context が list の場合', () => {
    it('本のメッセージを返す', () => {
      const message = getMessage('本', 'list');

      expect(message.title).toBe('まだ本が登録されていません');
      expect(message.description).toBe('最初の本を登録してみましょう');
    });

    it('リストのメッセージを返す', () => {
      const message = getMessage('リスト', 'list');

      expect(message.title).toBe('まだリストが登録されていません');
      expect(message.description).toBe('最初のリストを登録してみましょう');
    });

    it('カードのメッセージを返す', () => {
      const message = getMessage('カード', 'list');

      expect(message.title).toBe('まだカードが登録されていません');
      expect(message.description).toBe('最初のカードを登録してみましょう');
    });
  });

  describe('context が detail の場合', () => {
    it('本のメッセージを返す', () => {
      const message = getMessage('本', 'detail');

      expect(message.title).toBe('まだ本が登録されていません');
      expect(message.description).toBe('リストに本を追加してみましょう');
    });

    it('リストのメッセージを返す', () => {
      const message = getMessage('リスト', 'detail');

      expect(message.title).toBe('まだリストに追加されていません');
      expect(message.description).toBe('本をリストに追加してみましょう');
    });

    it('カードのメッセージを返す', () => {
      const message = getMessage('カード', 'detail');

      expect(message.title).toBe('まだカードが登録されていません');
      expect(message.description).toBe('カードを作成してメモを残しましょう');
    });
  });

  describe('context のデフォルト値', () => {
    it('contextを省略した場合、listとして扱われる', () => {
      const message = getMessage('本');

      expect(message.title).toBe('まだ本が登録されていません');
      expect(message.description).toBe('最初の本を登録してみましょう');
    });
  });
});
