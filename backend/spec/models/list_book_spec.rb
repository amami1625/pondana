require 'rails_helper'

RSpec.describe ListBook, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:list) }
    it { is_expected.to belong_to(:book) }
  end

  describe 'バリデーション' do
    context '重複の検証' do
      it '同じリストに同じ書籍を追加できないこと' do
        list = create(:list)
        book = create(:book, user: list.user)
        create(:list_book, list: list, book: book)
        duplicate_list_book = build(:list_book, list: list, book: book)
        expect(duplicate_list_book).not_to be_valid
        expect(duplicate_list_book.errors[:book_id]).to be_present
      end

      it '異なるリストであれば同じ書籍を追加できること' do
        user = create(:user)
        list1 = create(:list, user: user)
        list2 = create(:list, user: user)
        book = create(:book, user: user)
        create(:list_book, list: list1, book: book)
        list_book2 = build(:list_book, list: list2, book: book)
        expect(list_book2).to be_valid
      end
    end
  end
end
