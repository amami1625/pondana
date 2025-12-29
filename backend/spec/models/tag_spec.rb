require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:book_tags).dependent(:destroy) }
    it { is_expected.to have_many(:books).through(:book_tags) }
  end

  describe 'バリデーション' do
    subject(:tag) { build(:tag) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(100) }
    it { is_expected.to validate_uniqueness_of(:name).scoped_to(:user_id).case_insensitive }

    context '名前の重複' do
      it '異なるユーザーであれば同じ名前でも有効であること' do
        user1 = create(:user)
        user2 = create(:user)
        create(:tag, user: user1, name: '同じタグ')
        duplicate_tag = build(:tag, user: user2, name: '同じタグ')
        expect(duplicate_tag).to be_valid
      end
    end
  end

  describe '関連の削除' do
    let(:tag) { create(:tag) }

    it 'タグを削除すると関連するbook_tagsも削除されること' do
      book = create(:book, user: tag.user)
      create(:book_tag, book: book, tag: tag)
      expect { tag.destroy }.to change(BookTag, :count).by(-1)
    end
  end
end
