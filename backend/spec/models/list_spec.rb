require 'rails_helper'

RSpec.describe List, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:list_books).dependent(:destroy) }
    it { is_expected.to have_many(:books).through(:list_books) }
  end

  describe 'バリデーション' do
    subject(:list) { build(:list) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(255) }
    it { is_expected.to validate_uniqueness_of(:name).scoped_to(:user_id).case_insensitive }
    it { is_expected.to validate_inclusion_of(:public).in_array([true, false]) }

    context '名前の重複' do
      it '異なるユーザーであれば同じ名前でも有効であること' do
        user1 = create(:user)
        user2 = create(:user)
        create(:list, user: user1, name: '同じリスト')
        duplicate_list = build(:list, user: user2, name: '同じリスト')
        expect(duplicate_list).to be_valid
      end
    end
  end

  describe '関連の削除' do
    let(:list) { create(:list) }

    it 'リストを削除すると関連するlist_booksも削除されること' do
      book = create(:book, user: list.user)
      create(:list_book, list: list, book: book)
      expect { list.destroy }.to change(ListBook, :count).by(-1)
    end
  end
end
